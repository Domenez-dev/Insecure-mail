package models

import (
	"time"
)

type Subscriber struct {
	ID             uint      `gorm:"primaryKey"`
	Email          string    `gorm:"uniqueIndex;not null"`
	Name           string
	Subscribed     bool      `gorm:"default:true"`
	UnsubscribedAt *time.Time
	Plan           string    `gorm:"default:'free'"` // free, monthly, yearly
	PlanExpiresAt  *time.Time
	CreatedAt      time.Time

	Payments   []Payment   `gorm:"foreignKey:SubscriberID"`
	EmailsSent []EmailSent `gorm:"foreignKey:SubscriberID"`
}
