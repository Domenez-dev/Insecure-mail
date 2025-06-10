package models

import "time"

type Newsletter struct {
	ID        uint      `gorm:"primaryKey"`
	Subject   string    `gorm:"not null"`
	Content   string    `gorm:"type:text"`
	SentAt    *time.Time
	CreatedAt time.Time

	EmailsSent []EmailSent `gorm:"foreignKey:NewsletterID"`
}
