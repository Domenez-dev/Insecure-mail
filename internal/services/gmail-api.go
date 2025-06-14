package services

import (
	"bufio"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)

var gmailService *gmail.Service

// Retrieve a token, saves the token, then returns the generated client.
func getClient(config *oauth2.Config) *http.Client {
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	tokFile := "google-api/token.json"
	tok, err := tokenFromFile(tokFile)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(tokFile, tok)
	}
	return config.Client(context.Background(), tok)
}

// Request a token from the web, then returns the retrieved token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the authorization code:\n%v\n", authURL)

	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Enter the authorization code: ")
	authCode, err := reader.ReadString('\n')
	if err != nil {
		log.Fatalf("Unable to read authorization code: %v", err)
	}
	authCode = strings.TrimSpace(authCode)

	tok, err := config.Exchange(context.TODO(), authCode)
	if err != nil {
		log.Fatalf("Unable to retrieve token from web: %v", err)
	}
	return tok
}

// Retrieves a token from a local file.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

// Saves a token to a file path.
func saveToken(path string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", path)
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}

func InitGmail() {
	ctx := context.Background()
	b, err := os.ReadFile("google-api/credentials.json")
	if err != nil {
		log.Fatalf("❌ Unable to read client secret file: %v", err)
	}

	config, err := google.ConfigFromJSON(b, gmail.GmailSendScope)
	if err != nil {
		log.Fatalf("❌ Unable to parse client config: %v", err)
	}
	client := getClient(config)

	gmailService, err = gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("❌ Unable to initialize Gmail client: %v", err)
	}
	log.Println("📬 Gmail service initialized.")
}

func SendGmailOTP(to, subject, body string) error {
	if gmailService == nil {
		return fmt.Errorf("Gmail service not initialized")
	}

	from := os.Getenv("GMAIL_SENDER") // e.g.

	messageStr := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, to, subject, body)
	message := &gmail.Message{
		Raw: base64.URLEncoding.EncodeToString([]byte(messageStr)),
	}

	_, err := gmailService.Users.Messages.Send("me", message).Do()
	return err
}
