package models

type EmailSent struct {
	ID            uint `gorm:"primaryKey"`
	SubscriberID  uint
	NewsletterID  uint

	Subscriber Subscriber `gorm:"foreignKey:SubscriberID"`
	Newsletter Newsletter `gorm:"foreignKey:NewsletterID"`
}
