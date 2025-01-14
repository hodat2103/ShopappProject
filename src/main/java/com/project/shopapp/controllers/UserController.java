package com.project.shopapp.controllers;

import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.dtos.UserLoginDTO;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.models.User;
import com.project.shopapp.responses.UserResponse;
import com.project.shopapp.responses.messages.LoginMessageResponse;
import com.project.shopapp.responses.messages.RegisterMessageResponse;
import com.project.shopapp.services.impl.UserServiceImpl;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;
    private final LocalizationUtils localizationUtils;
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/register")
    public ResponseEntity<RegisterMessageResponse> create (
            @Valid @RequestBody UserDTO userDTO,
            BindingResult result
            ){
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(RegisterMessageResponse.builder()
                        .message(localizationUtils.getLocalizationMessage(MessageKeys.REGISTER_FAILED,errorMessages))
                        .build());

            }

            if(!userDTO.getPassword().equals(userDTO.getRetypePassword())){
                return ResponseEntity.badRequest().body(RegisterMessageResponse.builder()
                        .message(localizationUtils.getLocalizationMessage(MessageKeys.PASSWORD_NOT_MATCH))
                        .build());
            }
            User user = userService.create(userDTO);
            return  ResponseEntity.ok(RegisterMessageResponse.builder()
                    .message(localizationUtils.getLocalizationMessage(MessageKeys.REGISTER_SUCCESSFULLY))
                    .user(user)
                    .build());
        }catch(Exception e){
            return  ResponseEntity.badRequest().body(RegisterMessageResponse.builder()
                    .message(localizationUtils.getLocalizationMessage(MessageKeys.REGISTER_FAILED,e.getMessage()))
                    .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginMessageResponse> login (
            @Valid @RequestBody UserLoginDTO userLoginDTO
            ) throws InvalidParamException {
        try {
                String token = userService.login(userLoginDTO.getPhoneNumber(), userLoginDTO.getPassword(),
                        userLoginDTO.getRoleId() == null ? 1 : userLoginDTO.getRoleId());
                return ResponseEntity.ok(LoginMessageResponse.builder()
                                .message(localizationUtils.getLocalizationMessage(MessageKeys.LOGIN_SUCCESSFULLY))
                                .token(token)
                        .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(LoginMessageResponse.builder()
                    .message(localizationUtils.getLocalizationMessage(MessageKeys.LOGIN_FAILED, e.getMessage()))
                    .build());
        }
    }

    @PostMapping("/details")
    public ResponseEntity<UserResponse> getUserDetailsFromToken(@RequestHeader("Authorization") String authorizationHeader){
        try {
            String extractedToken = authorizationHeader.substring(7);
            User user = userService.getUserDetailsFromToken(extractedToken);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/details/{userId}")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable Long userId,
            @RequestBody UserDTO userDTO,
            @RequestHeader("Authorization") String authorizationHeader
    ){
        try {
            String extractedToken = authorizationHeader.substring(7);
            User user = userService.getUserDetailsFromToken(extractedToken);
            if(user.getId() != userId){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            User updateUser = userService.updateUserDetails(userId, userDTO);
            return ResponseEntity.ok(UserResponse.fromUser(updateUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
