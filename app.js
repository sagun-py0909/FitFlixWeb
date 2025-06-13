import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts setup
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'fitflix-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Mock data
const cities = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'delhi', name: 'Delhi', state: 'Delhi' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' }
];

const gyms = [
  { id: 1, name: 'FitZone Premium', location: 'Bandra West', city: 'mumbai', rating: 4.8, image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg' },
  { id: 2, name: 'PowerHouse Gym', location: 'Connaught Place', city: 'delhi', rating: 4.6, image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg' },
  { id: 3, name: 'Elite Fitness', location: 'Koramangala', city: 'bangalore', rating: 4.9, image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg' }
];

const trainers = [
  { id: 1, name: 'Rahul Sharma', specialization: 'Strength Training', experience: '8 years', city: 'mumbai', rating: 4.9, image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg' },
  { id: 2, name: 'Priya Singh', specialization: 'Yoga & Pilates', experience: '6 years', city: 'delhi', rating: 4.8, image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg' },
  { id: 3, name: 'Arjun Patel', specialization: 'CrossFit', experience: '5 years', city: 'bangalore', rating: 4.7, image: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg' }
];

// Middleware to set current city
app.use((req, res, next) => {
  if (!req.session.currentCity) {
    req.session.currentCity = cities[0];
  }
  res.locals.currentCity = req.session.currentCity;
  res.locals.cities = cities;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'Fitflix - Transform Your Fitness Journey',
    gyms: gyms.slice(0, 3),
    trainers: trainers.slice(0, 3)
  });
});

app.get('/gyms', (req, res) => {
  const cityGyms = gyms.filter(gym => gym.city === req.session.currentCity.id);
  res.render('gyms', { 
    title: 'Gyms & Fitness Centers',
    gyms: cityGyms
  });
});

app.get('/services', (req, res) => {
  res.render('services', { 
    title: 'Our Services'
  });
});

app.get('/memberships', (req, res) => {
  res.render('memberships', { 
    title: 'Membership Plans'
  });
});

app.get('/trainers', (req, res) => {
  const city = req.query.city || req.session.currentCity.id;
  const cityTrainers = trainers.filter(trainer => trainer.city === city);
  res.render('trainers', { 
    title: 'Personal Trainers',
    trainers: cityTrainers
  });
});

app.get('/trainer/:id', (req, res) => {
  const trainer = trainers.find(t => t.id === parseInt(req.params.id));
  if (!trainer) {
    return res.status(404).render('404', { title: 'Trainer Not Found' });
  }
  res.render('trainer-profile', { 
    title: `${trainer.name} - Personal Trainer`,
    trainer
  });
});

app.get('/city-selection', (req, res) => {
  res.render('city-selection', { 
    title: 'Select Your City'
  });
});

app.post('/select-city', (req, res) => {
  const selectedCity = cities.find(city => city.id === req.body.cityId);
  if (selectedCity) {
    req.session.currentCity = selectedCity;
  }
  res.redirect(req.body.returnUrl || '/');
});

app.get('/book', (req, res) => {
  res.render('book', { 
    title: 'Book Your Session'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`Fitflix server running on http://localhost:${PORT}`);
});