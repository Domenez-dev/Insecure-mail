package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/domenez-dev/Insecure-mail/internal/config"
	"github.com/domenez-dev/Insecure-mail/internal/models"
)

var DB *gorm.DB

func InitDB(csf *config.Config) *gorm.DB {
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		user, pass, host, port, name,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to MySQL:", err)
	}

	// Run migrations
	err = db.AutoMigrate(
		&models.Subscriber{},
		&models.Newsletter{},
		&models.EmailSent{},
		&models.Payment{},
		&models.AdminUser{},
	)
	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}

	log.Println("✅ Database connected and migrated.")
	DB = db
	return db
}
