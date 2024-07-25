package com.project.shopapp.services.impl;

import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.exceptions.InvalidParamException;
import com.project.shopapp.models.User;
import org.springframework.stereotype.Service;

@Service
public interface UserServiceImpl {
    User create(UserDTO userDTO) throws Exception;

    String login(String phoneNumber, String password, Long roleId) throws DataNotFoundException, InvalidParamException;

    User getUserDetailsFromToken(String token) throws Exception;

    User updateUserDetails(Long userId, UserDTO userDTO) throws DataNotFoundException;
}
