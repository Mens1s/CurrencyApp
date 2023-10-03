package com.example.mens1s.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
public class CsrfController {

    @CrossOrigin("http://localhost:4200")
    @GetMapping("api/csrf")
    public Map<String, String> getCsrfToken(HttpServletRequest request){
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        String token = csrfToken == null ? "" : csrfToken.getToken();
        return Collections.singletonMap("csrfToken", token);
    }
}
