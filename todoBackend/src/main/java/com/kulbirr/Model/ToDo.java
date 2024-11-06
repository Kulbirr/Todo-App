package com.kulbirr.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToDo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;

    private String tittle;

    private String description;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne
    private User user;
}
