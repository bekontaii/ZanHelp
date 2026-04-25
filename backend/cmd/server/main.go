package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"zanhelp/backend/internal/content"
)

type userStore struct {
	mu    sync.Mutex
	users map[string]user
}

type user struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Plan      string `json:"plan"`
	CreatedAt string `json:"createdAt"`
	Password  string `json:"-"`
}

type registerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type planRequest struct {
	Email string `json:"email"`
	Plan  string `json:"plan"`
}

type chatRequest struct {
	Message string `json:"message"`
}

type chatResponse struct {
	Reply string `json:"reply"`
}

func main() {
	mux := http.NewServeMux()
	store := &userStore{users: make(map[string]user)}

	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]string{"status": "ok"})
	})

	mux.HandleFunc("/api/content", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, content.Data())
	})

	mux.HandleFunc("/api/register", store.register)
	mux.HandleFunc("/api/login", store.login)
	mux.HandleFunc("/api/plan", store.updatePlan)
	mux.HandleFunc("/api/ai-chat", aiChat)
	mux.HandleFunc("/api/users", store.list)

	dist := firstExistingDir("frontend/dist", filepath.Join("..", "..", "frontend", "dist"))
	if _, err := os.Stat(dist); err == nil {
		mux.Handle("/", spaHandler(dist))
	}

	addr := ":8080"
	log.Printf("ZanHelp backend listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func aiChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req chatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	message := strings.ToLower(strings.TrimSpace(req.Message))
	if message == "" {
		http.Error(w, "message is required", http.StatusBadRequest)
		return
	}

	writeJSON(w, chatResponse{Reply: legalReply(message)})
}

func legalReply(message string) string {
	switch {
	case strings.Contains(message, "жұмыс") || strings.Contains(message, "жумыстан") || strings.Contains(message, "еңбек"):
		return "Еңбек мәселесінде алдымен еңбек шартыңызды, бұйрықты және жұмыс берушінің жазбаша хабарламасын тексеріңіз. Егер жұмыстан шығару заңсыз болса, еңбек инспекциясына немесе сотқа шағым беруге болады."
	case strings.Contains(message, "айыппұл") || strings.Contains(message, "айып") || strings.Contains(message, "штраф") || strings.Contains(message, "shtraf") || strings.Contains(message, "aiyppul"):
		return "Айыппұл бойынша қаулы нөмірін, күнін және төлеу мерзімін қараңыз. Егер келіспесеңіз, қаулыны алған күннен бастап заңда көрсетілген мерзім ішінде шағым беруге болады."
	case strings.Contains(message, "алимент") || strings.Contains(message, "неке") || strings.Contains(message, "ажырас"):
		return "Отбасы мәселесінде неке куәлігі, баланың туу туралы куәлігі және табыс туралы деректер маңызды. Алиментті келісім арқылы немесе сот тәртібімен өндіріп алуға болады."
	case strings.Contains(message, "келісімшарт") || strings.Contains(message, "шарт"):
		return "Келісімшартта тараптар, төлем, мерзім, жауапкершілік және бұзу тәртібі нақты жазылуы керек. Қол қоймас бұрын айыппұл, кепілдік және дауды шешу бөлімдерін мұқият оқыңыз."
	case strings.Contains(message, "тұтынушы") || strings.Contains(message, "тауар") || strings.Contains(message, "қайтар"):
		return "Тұтынушы ретінде сапасыз тауарға шағым жазып, чек пен дәлелдерді сақтаңыз. Сатушы жауап бермесе, тұтынушылар құқығын қорғау органына жүгінуге болады."
	default:
		return "Сұрағыңызды түсіндім. Нақты жауап беру үшін жағдайды қысқаша жазыңыз: не болды, қашан болды, қандай құжат бар және қандай нәтиже күтесіз. Бұл жауап жалпы ақпарат, толық құқықтық кеңес үшін заңгерге жүгінген дұрыс."
	}
}

func (s *userStore) login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	s.mu.Lock()
	defer s.mu.Unlock()

	found, exists := s.users[email]
	if !exists || found.Password != req.Password {
		http.Error(w, "email or password is incorrect", http.StatusUnauthorized)
		return
	}

	writeJSON(w, found)
}

func (s *userStore) updatePlan(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req planRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	plan := strings.TrimSpace(req.Plan)
	if email == "" || plan == "" {
		http.Error(w, "email and plan are required", http.StatusBadRequest)
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	found, exists := s.users[email]
	if !exists {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}
	found.Plan = plan
	s.users[email] = found
	writeJSON(w, found)
}

func (s *userStore) register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Name == "" || req.Email == "" || len(req.Password) < 6 {
		http.Error(w, "name, email and password with at least 6 characters are required", http.StatusBadRequest)
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.users[req.Email]; exists {
		http.Error(w, "user already exists", http.StatusConflict)
		return
	}

	created := user{
		ID:        len(s.users) + 1,
		Name:      req.Name,
		Email:     req.Email,
		Plan:      "Жазылым жоқ",
		CreatedAt: time.Now().Format("2006-01-02 15:04"),
		Password:  req.Password,
	}
	s.users[req.Email] = created

	writeJSONStatus(w, http.StatusCreated, created)
}

func (s *userStore) list(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	users := make([]user, 0, len(s.users))
	for _, item := range s.users {
		users = append(users, item)
	}
	writeJSON(w, users)
}

func writeJSON(w http.ResponseWriter, v any) {
	writeJSONStatus(w, http.StatusOK, v)
}

func writeJSONStatus(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func firstExistingDir(paths ...string) string {
	for _, path := range paths {
		if info, err := os.Stat(path); err == nil && info.IsDir() {
			return path
		}
	}
	return paths[0]
}

func spaHandler(dir string) http.Handler {
	fs := http.FileServer(http.Dir(dir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(dir, filepath.Clean(r.URL.Path))
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			fs.ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join(dir, "index.html"))
	})
}
