package com.neighborhood.servicefinder.seed;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.Role;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;
import com.neighborhood.servicefinder.service.ReviewService;

/**
 * Demo data for testing search, sentiment and analytics.
 * Runs only when application.properties contains:  app.seed=true
 * Safe to leave on: it skips itself if the demo data already exists.
 *
 * Demo logins (password for all: Test@1234):
 *   seed.provider1@nsf.test ... seed.provider6@nsf.test
 *   seed.user1@nsf.test     ... seed.user12@nsf.test
 *
 * Start the AI service BEFORE Spring Boot so reviews get sentiment analysis.
 */
@Component
@ConditionalOnProperty(name = "app.seed", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private static final String MARKER_EMAIL = "seed.provider1@nsf.test";
    private static final String PASSWORD = "Test@1234";

    private static final String[] PROVIDER_NAMES = {
            "Ramesh Patil", "Sunita Mhatre", "Imran Shaikh", "Deepak Naik", "Anita Rane", "Vikas Pawar"};
    private static final String[] AREAS = {
            "Virar West", "Virar East", "Nalasopara East", "Vasai Road", "Agashi", "Manvelpada, Virar"};
    // chance that a provider's review is positive (drives sentiment variety in the charts)
    private static final double[] PROVIDER_QUALITY = {0.90, 0.80, 0.70, 0.45, 0.85, 0.60};

    private static final String[] CUSTOMER_NAMES = {
            "Aarti Joshi", "Rohan Desai", "Neha Kulkarni", "Sagar More", "Pooja Shinde", "Amit Chavan",
            "Kiran Salvi", "Meena Gharat", "Rahul Vartak", "Sneha Raut", "Nilesh Mane", "Priya Bhoir"};

    // name, category, description, price, provider index
    private static final String[][] SERVICES = {
            {"Plumbing", "Home Repair", "Fixes leaking taps, burst pipes, blocked drains, bathroom fittings and water tank connections", "450", "0"},
            {"Home Cleaning", "Cleaning", "Deep cleaning of kitchens, bathrooms, floors and sofas before festivals or after renovation", "1200", "1"},
            {"Pest Control", "Cleaning", "Cockroach, termite and mosquito control treatment for homes and shops", "900", "1"},
            {"AC Repair", "Appliances", "AC servicing, gas refilling, cooling problems and water leakage from the indoor unit", "700", "2"},
            {"Appliance Repair", "Appliances", "Washing machine, refrigerator and microwave repair at your doorstep", "500", "2"},
            {"Electrician", "Home Repair", "Wiring, ceiling fan and switch repair, MCB tripping, inverter and power cut faults", "400", "3"},
            {"Math Tutor", "Education", "Home tuition for school maths and science, exam preparation and doubt solving", "600", "4"},
            {"Salon at Home", "Beauty", "Haircut, facial and grooming services at your home", "800", "4"},
            {"Carpenter", "Home Repair", "Furniture repair, door and window fixing, wardrobe and modular cabinet work", "550", "5"},
            {"Painter", "Home Repair", "Interior and exterior wall painting, waterproofing and polish", "1500", "5"}
    };
    // how popular each service is (same order as SERVICES)
    private static final double[] POPULARITY = {1.0, 0.9, 0.4, 0.8, 0.5, 0.9, 0.5, 0.3, 0.6, 0.4};

    private static final String[] POSITIVE = {
            "Very professional and polite. Finished the work on time and the quality was excellent.",
            "Great service at a fair price. Highly recommended!",
            "Arrived on time, very friendly behaviour, and the repair is perfect.",
            "Neat and clean work. Reasonable charges and prompt response.",
            "Excellent work and very respectful behaviour. Will book again."
    };
    private static final String[] MIXED = {
            "The work was fine but the technician came very late.",
            "Good quality work, however the price was a bit high.",
            "Polite person but took much longer than promised."
    };
    private static final String[] NEGATIVE = {
            "Terrible experience. Came very late and the work was poor.",
            "Rude behaviour and overcharged me. Would not recommend.",
            "Left the place dirty and the problem came back in two days."
    };

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final ReviewService reviewService;
    private final ObjectProvider<PasswordEncoder> encoderProvider;

    public DataSeeder(UserRepository userRepository,
                      ServiceRepository serviceRepository,
                      BookingRepository bookingRepository,
                      ReviewService reviewService,
                      ObjectProvider<PasswordEncoder> encoderProvider) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
        this.reviewService = reviewService;
        this.encoderProvider = encoderProvider;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(MARKER_EMAIL).isPresent()) {
            System.out.println("[Seeder] Demo data already exists, skipping.");
            return;
        }

        Random rnd = new Random(42);
        PasswordEncoder encoder = encoderProvider.getIfAvailable(BCryptPasswordEncoder::new);
        String hash = encoder.encode(PASSWORD);

        // ---- providers ----
        List<User> providers = new ArrayList<>();
        for (int i = 0; i < PROVIDER_NAMES.length; i++) {
            providers.add(newUser(PROVIDER_NAMES[i], "seed.provider" + (i + 1) + "@nsf.test", hash,
                    Role.ROLE_PROVIDER, AREAS[i], String.format("98200%05d", i + 1)));
        }
        providers = userRepository.saveAll(providers);

        // ---- customers ----
        List<User> customers = new ArrayList<>();
        for (int i = 0; i < CUSTOMER_NAMES.length; i++) {
            customers.add(newUser(CUSTOMER_NAMES[i], "seed.user" + (i + 1) + "@nsf.test", hash,
                    Role.ROLE_USER, AREAS[i % AREAS.length], String.format("98210%05d", i + 1)));
        }
        customers = userRepository.saveAll(customers);
        userRepository.save(newUser("Admin", "seed.admin@nsf.test", hash, Role.ROLE_ADMIN, "Virar West", "9820000000"));

        // ---- services ----
        List<Service> services = new ArrayList<>();
        for (String[] t : SERVICES) {
            Service s = new Service();
            s.setName(t[0]);
            s.setCategory(t[1]);
            s.setDescription(t[2]);
            s.setPrice(Double.parseDouble(t[3]));
            s.setProvider(providers.get(Integer.parseInt(t[4])));
            services.add(s);
        }
        services = serviceRepository.saveAll(services);

        // ---- bookings: ~140 over the last 6 months, skewed to recent (growing demand) ----
        LocalDate today = LocalDate.now();
        List<Booking> bookings = new ArrayList<>();
        for (int i = 0; i < 140; i++) {
            Service s = services.get(pick(POPULARITY, rnd));
            User customer = customers.get(rnd.nextInt(customers.size()));

            boolean future = rnd.nextDouble() < 0.07;
            int daysAgo = (int) (180 * Math.pow(rnd.nextDouble(), 1.6));
            LocalDate date = future ? today.plusDays(1 + rnd.nextInt(14)) : today.minusDays(daysAgo);

            String status;
            if (future || daysAgo < 3) {
                status = rnd.nextBoolean() ? "CONFIRMED" : "PENDING";
            } else {
                status = rnd.nextDouble() < 0.80 ? "DONE" : "CANCELLED";
            }

            LocalTime start = LocalTime.of(9 + rnd.nextInt(8), 0);

            Booking b = new Booking();
            b.setUser(customer);
            b.setService(s);
            b.setProvider(s.getProvider());
            b.setDate(date);
            b.setStartTime(start);
            b.setEndTime(start.plusHours(1 + rnd.nextInt(2)));
            b.setStatus(status);
            b.setPrice(s.getPrice());
            bookings.add(b);
        }
        bookings = bookingRepository.saveAll(bookings);

        // ---- reviews for ~70% of completed bookings (analyzed by the AI service) ----
        Map<Long, Double> quality = new HashMap<>();
        for (int i = 0; i < providers.size(); i++) {
            quality.put(providers.get(i).getId(), PROVIDER_QUALITY[i]);
        }

        int reviews = 0;
        boolean spamAdded = false;
        for (Booking b : bookings) {
            if (!"DONE".equals(b.getStatus()) || rnd.nextDouble() > 0.70) continue;

            String comment;
            int rating;
            if (!spamAdded && reviews == 5) {
                comment = "Best offers!!! visit www.cheap-deals-now.xyz to win prizes";
                rating = 5;
                spamAdded = true;
            } else {
                double q = quality.get(b.getProvider().getId());
                double roll = rnd.nextDouble();
                if (roll < q) {
                    comment = POSITIVE[rnd.nextInt(POSITIVE.length)];
                    rating = 4 + rnd.nextInt(2);
                } else if (roll < q + (1 - q) / 2) {
                    comment = MIXED[rnd.nextInt(MIXED.length)];
                    rating = 3;
                } else {
                    comment = NEGATIVE[rnd.nextInt(NEGATIVE.length)];
                    rating = 1 + rnd.nextInt(2);
                }
            }

            Review r = new Review(b, b.getUser(), b.getService(), rating, comment);
            r.setCreatedAt(b.getDate().plusDays(1).atTime(18, 0));
            reviewService.addReview(r); // runs AI sentiment analysis, then saves
            reviews++;
        }

        System.out.println("[Seeder] Created " + providers.size() + " providers, " + customers.size()
                + " customers, " + services.size() + " services, " + bookings.size()
                + " bookings and " + reviews + " reviews. Password for all: " + PASSWORD);
    }

    private static User newUser(String name, String email, String passwordHash, Role role,
                                String address, String phone) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(passwordHash);
        u.setRole(role);
        u.setAddress(address);
        u.setPhoneNumber(phone);
        return u;
    }

    private static int pick(double[] weights, Random rnd) {
        double total = 0;
        for (double w : weights) total += w;
        double r = rnd.nextDouble() * total;
        for (int i = 0; i < weights.length; i++) {
            r -= weights[i];
            if (r <= 0) return i;
        }
        return weights.length - 1;
    }
}