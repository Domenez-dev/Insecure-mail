package models

import "time"

type Payment struct {
	ID            uint    `gorm:"primaryKey"`
	SubscriberID  uint
	PaypalTxnID   string  `gorm:"uniqueIndex"`
	Amount        float64
	Currency      string
	Status        string  // e.g., "completed", "pending", "failed"
	PaidAt        time.Time

	Subscriber Subscriber `gorm:"foreignKey:SubscriberID"`
}
