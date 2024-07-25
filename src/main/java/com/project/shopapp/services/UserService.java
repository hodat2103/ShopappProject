package com.project.shopapp.services;

import com.project.shopapp.components.JwtTokenUtils;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.exceptions.PermissionDenyException;
import com.project.shopapp.models.Role;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.RoleRepository;
import com.project.shopapp.repositories.UserRepository;
import com.project.shopapp.services.impl.UserServiceImpl;
import com.project.shopapp.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserServiceImpl {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final LocalizationUtils localizationUtils;
    @Override
    public User create(UserDTO userDTO) throws Exception{
        String phoneNumber = userDTO.getPhoneNumber();
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }
        Role role = roleRepository.findById(userDTO.getRoleId())
                .orElseThrow(() -> new DataNotFoundException("Role not found "));
        if(role.getName().toUpperCase().equals(Role.ADMIN)){
            throw new PermissionDenyException("Cannot register a admin account");
        }
        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())
                .address(userDTO.getAddress())
                .dateOfBirth(userDTO.getDateOfBirth())
                .facebookAccountId(userDTO.getFacebookAccountId())
                .googleAccountId(userDTO.getGoogleAccountId())
                .role(role)
                .build();



       // newUser.setRole(existsRole);

        if (userDTO.getFacebookAccountId() == 0 && userDTO.getGoogleAccountId() == 0) {
            String password = userDTO.getPassword();
            String encodePassword = passwordEncoder.encode(password);
            newUser.setPassword(encodePassword);
        }
        User user = userRepository.save(newUser);
        return user;
    }

    @Override
    public String login(String phoneNumber, String password, Long roleId) throws DataNotFoundException, InvalidParamException {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if(optionalUser.isEmpty()){
            throw new DataNotFoundException(localizationUtils.getLocalizationMessage(MessageKeys.PASSWORD_NOT_MATCH));
        }
//        return optionalUser.get();
        User existingUser = optionalUser.get();
        //check password and compare with password decoded
        if (existingUser.getFacebookAccountId() == 0 && existingUser.getGoogleAccountId() == 0) {
            if (!passwordEncoder.matches(password,existingUser.getPassword())){
                throw new BadCredentialsException(localizationUtils.getLocalizationMessage(MessageKeys.PASSWORD_NOT_MATCH));
            }
        }
        Optional<Role> optionalRole = roleRepository.findById(roleId);
        if(optionalRole.isEmpty() || !roleId.equals(existingUser.getRole().getId())){
            throw new DataNotFoundException(localizationUtils.getLocalizationMessage(MessageKeys.ROLE_DOES_NOT_EXISTS));
        }
        if(!optionalUser.get().isActive()){
            throw new DataNotFoundException(localizationUtils.getLocalizationMessage(MessageKeys.USER_IS_LOCKED));
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                phoneNumber,password,
                existingUser.getAuthorities()
        );
        //authenticate JSBoot
        authenticationManager.authenticate(authenticationToken);
        return jwTokenUtil.generateToken(existingUser);
    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if(jwTokenUtil.isTokenExpired(token)){
            throw new Exception("Token is expired");
        }
        String phoneNumber = jwTokenUtil.extractPhoneNumber(token);
        Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);
        if(user.isPresent()){
            return user.get();
        }else{
            throw new Exception("User not found");
        }
    }

    @Transactional
    @Override
    public User updateUserDetails(Long userId, UserDTO userDTO) throws DataNotFoundException {
        User existingUser = userRepository.findById(userId).orElseThrow(()
                -> new DataNotFoundException("Not found user"));
        String newPhoneNumber = userDTO.getPhoneNumber();
        if(!existingUser.getPhoneNumber().equals(newPhoneNumber)
                && userRepository.existsByPhoneNumber(newPhoneNumber)){
            throw new DataIntegrityViolationException("Phone number already exists");
        }
        if(newPhoneNumber != null){
            existingUser.setPhoneNumber(newPhoneNumber);
        }
        if(userDTO.getFullName() != null){
            existingUser.setFullName(userDTO.getFullName());
        }
        if(userDTO.getAddress() != null){
            existingUser.setAddress(userDTO.getAddress());
        }
        if(userDTO.getDateOfBirth() != null){
            existingUser.setDateOfBirth(userDTO.getDateOfBirth());
        }
        if(userDTO.getFacebookAccountId() > 0){
            existingUser.setFacebookAccountId(userDTO.getFacebookAccountId());
        }
        if(userDTO.getGoogleAccountId() > 0 ){
            existingUser.setGoogleAccountId(userDTO.getGoogleAccountId());
        }

        if(userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()){
            if(!userDTO.getPassword().equals(userDTO.getRetypePassword())){
                throw new DataNotFoundException("Password and retype password not duplicate");
            }
            String newPassword = userDTO.getPassword();
            String encodePassword = passwordEncoder.encode(newPassword);
            existingUser.setPassword(encodePassword);
        }
        userRepository.save(existingUser);
        return existingUser;

    }


}
