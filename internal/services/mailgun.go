package services

import (
	"context"
	"os"
	"time"

	"github.com/mailgun/mailgun-go/v5"
)

func sendMailgunOTP(email, subject, body string) error {
	domain := os.Getenv("MAILGUN_DOMAIN")
	apiKey := os.Getenv("MAILGUN_API_KEY")
	sender := os.Getenv("MAILGUN_SENDER")

	mg := mailgun.NewMailgun(apiKey)
	message := mailgun.NewMessage(domain, sender, subject, body, email)

	// Send the message with a 10-second timeout
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	_, err := mg.Send(ctx, message)
	return err
}
