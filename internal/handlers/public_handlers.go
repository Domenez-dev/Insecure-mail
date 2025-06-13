package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

// Public page handlers
func HomePage(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{
		"CurrentPath": c.Path(),
		"CurrentYear": time.Now().Year(),
		// Add other data as needed
	})
}

func AboutPage(c *fiber.Ctx) error {
	return c.Render("about", fiber.Map{})
}

func LoginPage(c *fiber.Ctx) error {
	return c.Render("login", fiber.Map{})
}

func ConfirmationPage(c *fiber.Ctx) error {
	return c.Render("confirmation", fiber.Map{})
}

func UnsubscribePage(c *fiber.Ctx) error {
	return c.Render("unsubscribe", fiber.Map{})
}
