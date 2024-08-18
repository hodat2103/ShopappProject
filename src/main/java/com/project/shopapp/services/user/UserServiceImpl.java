package com.project.shopapp.services.user;

import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.exceptions.InvalidPasswordException;
import com.project.shopapp.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserServiceImpl {
    User create(UserDTO userDTO) throws Exception;

    String login(String phoneNumber, String password, Long roleId) throws DataNotFoundException, InvalidParamException;

    User getUserDetailsFromToken(String token) throws Exception;

    User updateUserDetails(Long userId, UserDTO userDTO) throws DataNotFoundException;
    Page<User> findAll(String keyword, Pageable pageable) throws Exception;
    String resetPassword(String email, String newPassword)
            throws InvalidPasswordException, DataNotFoundException;
    List<User> getAll();
}
