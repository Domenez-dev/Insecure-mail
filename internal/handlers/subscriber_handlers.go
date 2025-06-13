package handlers

import "github.com/gofiber/fiber/v2"

// Subscriber page handlers
func SubscriberDashboard(c *fiber.Ctx) error {
	return c.Render("subscriber/dashboard", fiber.Map{})
}

func SubscriberEmails(c *fiber.Ctx) error {
	return c.Render("subscriber/emails", fiber.Map{})
}

func SubscriberEmailView(c *fiber.Ctx) error {
	return c.Render("subscriber/email_view", fiber.Map{
		"ID": c.Params("id"),
	})
}

func SubscriberAccount(c *fiber.Ctx) error {
	return c.Render("subscriber/account", fiber.Map{})
}

func SubscriberPlans(c *fiber.Ctx) error {
	return c.Render("subscriber/plans", fiber.Map{})
}

func SubscriberPayment(c *fiber.Ctx) error {
	return c.Render("subscriber/payment", fiber.Map{})
}

func SubscriberPaymentSuccess(c *fiber.Ctx) error {
	return c.Render("subscriber/payment_success", fiber.Map{})
}
