package handlers

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/domenez-dev/Insecure-mail/internal/database"
	"github.com/domenez-dev/Insecure-mail/internal/models"
	"github.com/domenez-dev/Insecure-mail/internal/services"
	"github.com/gofiber/fiber/v2"
)

var otpCache = make(map[string]string) // email -> otp
func expireOTP(email string) {
	time.Sleep(5 * time.Minute)
	delete(otpCache, strings.ToLower(email))
}

func RegisterPage(c *fiber.Ctx) error {
	return c.Render("register", fiber.Map{})
}

// POST /register/send-otp
func SendOTP(c *fiber.Ctx) error {
	type request struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	var body request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid data"})
	}

	// Validate email format
	if !strings.Contains(body.Email, "@") || !strings.Contains(body.Email, ".") {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid email format"})
	}

	otp := fmt.Sprintf("%06d", rand.Intn(1000000))
	fmt.Println("OTP: ", otp) // For debugging, remove in production
	otpCache[strings.ToLower(body.Email)] = otp
	go expireOTP(body.Email)

	subject := fmt.Sprintf("Your OTP for %s", body.Name)
	message := fmt.Sprintf("Your OTP is %s", otp)

	if err := services.SendGmailOTP(body.Email, subject, message); err != nil {
		log.Printf("Gmail API error for %s: %v", body.Email, err)
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to send OTP",
			"details": err.Error(), // Send the actual error to frontend for debugging
		})
	}

	return c.JSON(fiber.Map{"message": "OTP sent successfully"})
}

// POST /register/verify
func VerifyAndRegister(c *fiber.Ctx) error {
	type request struct {
		Email    string `json:"email"`
		Name     string `json:"name"`
		Password string `json:"password"`
		Plan     string `json:"plan"`
		OTP      string `json:"otp"`
	}

	var body request
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	expected := otpCache[strings.ToLower(body.Email)]
	if expected == "" || expected != body.OTP {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid or expired OTP"})
	}

	delete(otpCache, strings.ToLower(body.Email)) // invalidate

	subscriber := models.Subscriber{
		Email:      body.Email,
		Name:       body.Name,
		Plan:       body.Plan,
		Subscribed: true,
		CreatedAt:  time.Now(),
	}

	if err := database.DB.Create(&subscriber).Error; err != nil {
		log.Println("DB insert error:", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to register user"})
	}

	return c.JSON(fiber.Map{"message": "Registration successful"})
}
