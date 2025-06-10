package config

import "os"

type Config struct {
    Port     string
    DB_USER   string
    DB_PASS   string
    DB_HOST   string
    DB_PORT   string
    DB_NAME   string
    // Add other config fields as needed
}

func LoadConfig() *Config {
    return &Config{
        Port:   os.Getenv("PORT"),
        DB_USER: os.Getenv("DB_USER"),
        DB_PASS: os.Getenv("DB_PASS"),
        DB_HOST: os.Getenv("DB_HOST"),
        DB_PORT: os.Getenv("DB_PORT"),
        DB_NAME: os.Getenv("DB_NAME"),
    }
}
