package com.example.mens1s.service;

import com.example.mens1s.dto.UserDto;
import com.example.mens1s.model.User;
import com.example.mens1s.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;

    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public void saveUser(User user) {
        user.setPassword(user.getPassword());
        userRepository.save(user);
    }
}
