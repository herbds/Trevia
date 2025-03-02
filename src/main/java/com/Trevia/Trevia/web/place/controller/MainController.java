package com.Trevia.Trevia.web.place.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/Trevia/inicio")
    public String home() {
        return "index";
    }

    @GetMapping("/Trevia/menu")
    public String menu() {
        return "menu";
    }

    @GetMapping("/Trevia/about")
    public String about() {
        return "about";
    }
    @GetMapping("/Trevia/order")
    public String order() {
        return "order";
    }
}
