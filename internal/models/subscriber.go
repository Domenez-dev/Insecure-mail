package models

import "time"

type Subscriber struct {
	ID             uint   `gorm:"primaryKey"`
	Email          string `gorm:"type:varchar(255);uniqueIndex;not null"`
	Name           string `gorm:"type:varchar(255)"`
	Subscribed     bool   `gorm:"default:true"`
	UnsubscribedAt *time.Time
	Plan           string `gorm:"type:varchar(50);default:'free'"` // free, monthly, yearly
	PlanExpiresAt  *time.Time
	CreatedAt      time.Time

	Payments   []Payment   `gorm:"foreignKey:SubscriberID"`
	EmailsSent []EmailSent `gorm:"foreignKey:SubscriberID"`
}
