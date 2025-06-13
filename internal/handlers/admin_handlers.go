package handlers

import "github.com/gofiber/fiber/v2"

// Admin page handlers
func AdminDashboard(c *fiber.Ctx) error {
	return c.Render("admin/dashboard", fiber.Map{})
}

func AdminSubscribers(c *fiber.Ctx) error {
	return c.Render("admin/subscribers", fiber.Map{})
}

func AdminSubscriberDetail(c *fiber.Ctx) error {
	return c.Render("admin/subscriber_detail", fiber.Map{
		"ID": c.Params("id"),
	})
}

func AdminNewsletters(c *fiber.Ctx) error {
	return c.Render("admin/newsletters", fiber.Map{})
}

func AdminNewsletterCreate(c *fiber.Ctx) error {
	return c.Render("admin/newsletter_create", fiber.Map{})
}

func AdminNewsletterPreview(c *fiber.Ctx) error {
	return c.Render("admin/newsletter_preview", fiber.Map{})
}

func AdminSendLogs(c *fiber.Ctx) error {
	return c.Render("admin/send_logs", fiber.Map{})
}

func AdminPayments(c *fiber.Ctx) error {
	return c.Render("admin/payments", fiber.Map{})
}
