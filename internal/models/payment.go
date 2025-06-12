package models

import "time"

type Payment struct {
	ID            uint `gorm:"primaryKey"`
	SubscriberID  uint
	PaypalTxnID   string `gorm:"type:varchar(191);uniqueIndex"` // Fix key length error
	Amount        float64
	Currency      string `gorm:"type:varchar(10)"`
	Status        string `gorm:"type:varchar(50)"` // e.g., "completed", "pending", "failed"
	Plan          string `gorm:"type:varchar(50)"` // free, premium, yearly
	PaidAt        time.Time
	PlanExpiresAt time.Time

	Subscriber Subscriber `gorm:"foreignKey:SubscriberID"`
}
