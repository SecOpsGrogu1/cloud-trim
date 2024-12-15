package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"log"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type Session struct {
	Token     string
	UserID    string
	ExpiresAt time.Time
}

type AuthManager struct {
	users    map[string]User
	sessions map[string]Session
	mu       sync.RWMutex
}

func NewAuthManager() *AuthManager {
	am := &AuthManager{
		users:    make(map[string]User),
		sessions: make(map[string]Session),
	}

	// Create a default test account
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	testUser := User{
		ID:       "test-user-id",
		Name:     "Test User",
		Email:    "test@example.com",
		Password: string(hashedPassword),
	}
	am.users[testUser.ID] = testUser
	log.Printf("Created default test account with email: %s", testUser.Email)

	return am
}

func generateID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

func (am *AuthManager) CreateUser(name, email, password string) (*User, error) {
	am.mu.Lock()
	defer am.mu.Unlock()

	log.Printf("Attempting to create user with email: %s", email)

	// Check if email already exists
	for _, u := range am.users {
		if u.Email == email {
			log.Printf("User creation failed: email already exists: %s", email)
			return nil, errors.New("email already exists")
		}
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash password: %v", err)
		return nil, err
	}

	user := User{
		ID:       generateID(),
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}

	am.users[user.ID] = user
	log.Printf("Successfully created user with email: %s", email)
	return &user, nil
}

func (am *AuthManager) Login(email, password string) (*Session, *User, error) {
	am.mu.RLock()
	defer am.mu.RUnlock()

	log.Printf("Login attempt for email: %s", email)

	// Find user by email
	var user User
	var found bool
	for _, u := range am.users {
		if u.Email == email {
			user = u
			found = true
			break
		}
	}

	if !found {
		log.Printf("Login failed: user not found with email: %s", email)
		return nil, nil, errors.New("invalid credentials")
	}

	// Check password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		log.Printf("Login failed: invalid password for email: %s", email)
		return nil, nil, errors.New("invalid credentials")
	}

	// Create session
	token := generateID()
	session := Session{
		Token:     token,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	am.sessions[token] = session
	log.Printf("Login successful for email: %s", email)
	return &session, &user, nil
}

func (am *AuthManager) GetUserBySession(token string) (*User, error) {
	am.mu.RLock()
	defer am.mu.RUnlock()

	session, exists := am.sessions[token]
	if !exists || time.Now().After(session.ExpiresAt) {
		return nil, errors.New("invalid or expired session")
	}

	user, exists := am.users[session.UserID]
	if !exists {
		return nil, errors.New("user not found")
	}

	return &user, nil
}

func (am *AuthManager) Logout(token string) {
	am.mu.Lock()
	defer am.mu.Unlock()
	delete(am.sessions, token)
	log.Printf("User logged out with session token: %s", token)
}
