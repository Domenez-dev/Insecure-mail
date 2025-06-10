package config

import "os"

type Config struct {
    Port     string
    DBUser   string
    DBPass   string
    DBHost   string
    DBPort   string
    DBName   string
    // Add other config fields as needed
}

func LoadConfig() *Config {
    return &Config{
        Port:   os.Getenv("PORT"),
        DBUser: os.Getenv("DB_USER"),
        DBPass: os.Getenv("DB_PASS"),
        DBHost: os.Getenv("DB_HOST"),
        DBPort: os.Getenv("DB_PORT"),
        DBName: os.Getenv("DB_NAME"),
    }
}
