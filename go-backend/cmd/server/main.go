package main

import (
	"log"
	"net/http"
	"time"

	"github.com/SecOpsGrogu1/cloud-cost-optimizer/go-backend/internal/auth"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize auth manager
	authManager := auth.NewAuthManager()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Auth endpoints
	r.POST("/auth/signup", func(c *gin.Context) {
		var req struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.BindJSON(&req); err != nil {
			log.Printf("Signup failed: invalid request body: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("Signup request received for email: %s", req.Email)

		user, err := authManager.CreateUser(req.Name, req.Email, req.Password)
		if err != nil {
			log.Printf("Signup failed: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		session, _, err := authManager.Login(req.Email, req.Password)
		if err != nil {
			log.Printf("Auto-login after signup failed: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.SetCookie("session", session.Token, 86400, "/", "", false, true)
		log.Printf("Signup successful for user: %s", user.Email)
		c.JSON(http.StatusOK, user)
	})

	r.POST("/auth/login", func(c *gin.Context) {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}

		if err := c.BindJSON(&req); err != nil {
			log.Printf("Login failed: invalid request body: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("Login request received for email: %s", req.Email)

		session, user, err := authManager.Login(req.Email, req.Password)
		if err != nil {
			log.Printf("Login failed for %s: %v", req.Email, err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		c.SetCookie("session", session.Token, 86400, "/", "", false, true)
		log.Printf("Login successful for user: %s", user.Email)
		c.JSON(http.StatusOK, user)
	})

	r.POST("/auth/logout", func(c *gin.Context) {
		token, _ := c.Cookie("session")
		if token != "" {
			authManager.Logout(token)
			log.Printf("User logged out with session: %s", token)
		}
		c.SetCookie("session", "", -1, "/", "", false, true)
		c.Status(http.StatusOK)
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
		})
	})

	// Start server
	log.Printf("Starting server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
