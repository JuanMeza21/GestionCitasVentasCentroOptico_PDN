package com.example.backend_GCVCO.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.backend_GCVCO.Usuario;
import com.example.backend_GCVCO.Services.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:3000") 
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> obtenerUsuarios() throws Exception {
        return usuarioService.obtenerUsuarios();
    }

    @PostMapping
    public String crearUsuario(@RequestBody Usuario usuario) throws Exception {
        return usuarioService.crearUsuario(usuario);
    }

    @PutMapping("/{uid}")
    public String actualizarUsuario(@PathVariable String uid, @RequestBody Usuario usuario) throws Exception {
        return usuarioService.actualizarUsuario(uid, usuario);
    }

    @DeleteMapping("/{uid}")
    public String eliminarUsuario(@PathVariable String uid) throws Exception {
        return usuarioService.eliminarUsuario(uid);
    }
}
