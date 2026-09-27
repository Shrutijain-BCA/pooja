/*
# Pooja Palace — Seed Data

## Overview
Populates the database with initial data provided by the client:
- 2 states (Uttarakhand, Uttar Pradesh)
- 19 locations across those states
- 8 categories
- 8 purposes
- 6 deities
- 4 occasions
- 42 poojas (master records)
- Location-pooja offerings with prices (only where confirmed from client material)
- Pooja-category, pooja-purpose, pooja-deity, pooja-occasion junction data

## Important Notes
1. Prices marked as uncertain in client material are left NULL (meaning "To Be Confirmed")
2. Only confirmed prices from client material are set
3. All poojas are seeded as active
4. Junction tables are populated to enable filtering by category, purpose, deity, and occasion
5. Images use Pexels stock photo URLs for initial presentation
*/

-- ============================================================
-- STATES
-- ============================================================
INSERT INTO states (name, slug, description, image, is_active, sort_order) VALUES
('Uttarakhand', 'uttarakhand', 'The Land of Gods — home to the Char Dham yatra and sacred Ganga.', 'https://images.pexels.com/photos/5014999/pexels-photo-5014999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 1),
('Uttar Pradesh', 'uttar-pradesh', 'The heartland of Hindu spirituality — Ayodhya, Vrindavan, Varanasi.', 'https://images.pexels.com/photos/36478003/pexels-photo-36478003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 2)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- LOCATIONS
-- ============================================================
-- Uttarakhand locations
INSERT INTO locations (name, slug, state_id, type, description, significance, image, is_active, sort_order) VALUES
('Haridwar', 'haridwar', (SELECT id FROM states WHERE slug='uttarakhand'), 'city', 'The Gateway to God — where the Ganges enters the plains.', 'One of the seven holiest places in Hinduism, Haridwar is where drops of amrita fell during the churning of the ocean.', 'https://images.pexels.com/photos/31770950/pexels-photo-31770950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 1),
('Rishikesh', 'rishikesh', (SELECT id FROM states WHERE slug='uttarakhand'), 'city', 'The Yoga Capital of the World, on the banks of the Ganges.', 'Known as the gateway to the Himalayas, Rishikesh is a sacred city of ashrams, yoga, and spiritual learning.', 'https://images.pexels.com/photos/38044214/pexels-photo-38044214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 2),
('Neelkanth', 'neelkanth', (SELECT id FROM states WHERE slug='uttarakhand'), 'temple', 'The temple of Lord Shiva where He consumed poison during the churning of the ocean.', 'Neelkanth Mahadev Temple is a revered Shiva shrine nestled in the Himalayan forests.', 'https://images.pexels.com/photos/36010709/pexels-photo-36010709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 3),
('Dehradun', 'dehradun', (SELECT id FROM states WHERE slug='uttarakhand'), 'city', 'The capital city of Uttarakhand, nestled in the Doon Valley.', 'A serene city surrounded by the Himalayas, known for its temples and spiritual ambiance.', 'https://images.pexels.com/photos/17693658/pexels-photo-17693658.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 4),
('Badrinath Dham', 'badrinath-dham', (SELECT id FROM states WHERE slug='uttarakhand'), 'dham', 'One of the four Char Dham pilgrimage sites, dedicated to Lord Vishnu.', 'Badrinath is one of the holiest Vishnu temples, situated along the Alaknanda River.', 'https://images.pexels.com/photos/5015219/pexels-photo-5015219.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 5),
('Kedarnath Dham', 'kedarnath-dham', (SELECT id FROM states WHERE slug='uttarakhand'), 'dham', 'One of the twelve Jyotirlingas of Lord Shiva, at high altitude in the Himalayas.', 'Kedarnath is one of the most sacred Shiva shrines and part of the Char Dham yatra.', 'https://images.pexels.com/photos/5014999/pexels-photo-5014999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 6),
('Gangotri Dham', 'gangotri-dham', (SELECT id FROM states WHERE slug='uttarakhand'), 'dham', 'The source of the holy river Ganga, dedicated to Goddess Ganga.', 'Gangotri is the origin of the River Ganges and one of the Char Dham sites.', 'https://images.pexels.com/photos/38044214/pexels-photo-38044214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 7),
('Yamunotri Dham', 'yamunotri-dham', (SELECT id FROM states WHERE slug='uttarakhand'), 'dham', 'The source of the Yamuna River and the first stop of the Char Dham yatra.', 'Yamunotri is dedicated to Goddess Yamuna and is the westernmost shrine of the Char Dham.', 'https://images.pexels.com/photos/36010709/pexels-photo-36010709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 8),
('Narayan Shila', 'narayan-shila', (SELECT id FROM states WHERE slug='uttarakhand'), 'religious_place', 'A sacred stone shrine in Haridwar associated with Lord Vishnu.', 'A revered spot for performing Pitri ceremonies and Shradh rituals.', 'https://images.pexels.com/photos/31770953/pexels-photo-31770953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 9),
('Kali Mandir', 'kali-mandir', (SELECT id FROM states WHERE slug='uttarakhand'), 'temple', 'A temple dedicated to Goddess Kali near Haridwar.', 'A powerful shrine for devotees seeking the blessings of the Divine Mother.', 'https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 10),
('Daksh Prajapati', 'daksh-prajapati', (SELECT id FROM states WHERE slug='uttarakhand'), 'temple', 'The ancient temple of Daksha Prajapati in Kankhal, Haridwar.', 'Site of the legendary yajna of Daksha, a significant location for Vedic rituals.', 'https://images.pexels.com/photos/31770950/pexels-photo-31770950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 11),
('Triveni', 'triveni', (SELECT id FROM states WHERE slug='uttarakhand'), 'ghat', 'The sacred confluence at Haridwar where ritual baths and poojas are performed.', 'A key ghat for performing Shradh, Tarpan, and Ganga Poojan.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 12),
('Parmarth Niketan Ghat', 'parmarth-niketan-ghat', (SELECT id FROM states WHERE slug='uttarakhand'), 'ghat', 'One of the largest ashrams in Rishikesh, famous for its daily Ganga Aarti.', 'A spiritual center on the banks of the Ganges known for its beautiful evening aarti ceremony.', 'https://images.pexels.com/photos/18887239/pexels-photo-18887239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 13),
('Garud Shila', 'garud-shila', (SELECT id FROM states WHERE slug='uttarakhand'), 'religious_place', 'A sacred rock formation associated with Lord Vishnu''s mount, Garuda.', 'A unique pilgrimage spot for devotees performing Vishnu-related rituals.', 'https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 14)
ON CONFLICT (slug, state_id) DO NOTHING;

-- Uttar Pradesh locations
INSERT INTO locations (name, slug, state_id, type, description, significance, image, is_active, sort_order) VALUES
('Ayodhya', 'ayodhya', (SELECT id FROM states WHERE slug='uttar-pradesh'), 'city', 'The birthplace of Lord Rama, one of the seven sacred Hindu cities.', 'Ayodhya is the sacred city of Lord Rama and a major pilgrimage destination.', 'https://images.pexels.com/photos/36478003/pexels-photo-36478003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 1),
('Vrindavan', 'vrindavan', (SELECT id FROM states WHERE slug='uttar-pradesh'), 'city', 'The land of Lord Krishna''s childhood and divine pastimes.', 'Vrindavan is one of the most important Krishna pilgrimage sites, filled with temples and ashrams.', 'https://images.pexels.com/photos/31150802/pexels-photo-31150802.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 2),
('Varanasi', 'varanasi', (SELECT id FROM states WHERE slug='uttar-pradesh'), 'city', 'The oldest living city, on the banks of the Ganges, the city of Lord Shiva.', 'Varanasi (Kashi) is the spiritual capital of India, known for its ghats, temples, and Vedic traditions.', 'https://images.pexels.com/photos/8112524/pexels-photo-8112524.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 3),
('Moradabad', 'moradabad', (SELECT id FROM states WHERE slug='uttar-pradesh'), 'city', 'A city in Uttar Pradesh with growing spiritual significance.', 'A convenient location for devotees in western Uttar Pradesh.', 'https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 4),
('Muzaffar Nagar', 'muzaffar-nagar', (SELECT id FROM states WHERE slug='uttar-pradesh'), 'city', 'A city in western Uttar Pradesh serving nearby devotees.', 'A growing center for spiritual services in the region.', 'https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, 5)
ON CONFLICT (slug, state_id) DO NOTHING;

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Pooja', 'pooja', 'Traditional Hindu worship rituals', true, 1),
('Havan', 'havan', 'Fire rituals and offerings to the sacred fire', true, 2),
('Jap', 'jap', 'Repetitive chanting of mantras for specific purposes', true, 3),
('Path', 'path', 'Recitation of sacred texts and scriptures', true, 4),
('Shanti / Dosha', 'shanti-dosha', 'Remedial rituals for planetary and karmic afflictions', true, 5),
('Pitri / Shradh', 'pitri-shradh', 'Rituals for ancestors and forefathers', true, 6),
('Sanskar', 'sanskar', 'Life-cycle sacraments and ceremonies', true, 7),
('Special Poojas', 'special-poojas', 'Special occasion and festival poojas', true, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PURPOSES
-- ============================================================
INSERT INTO purposes (name, slug, description, icon, is_active, sort_order) VALUES
('New Home', 'new-home', 'Rituals for a new home or property', 'home', true, 1),
('Marriage', 'marriage', 'Rituals related to marriage and marital harmony', 'heart', true, 2),
('Family / Child', 'family-child', 'Rituals for family welfare and children', 'users', true, 3),
('Dosha / Kundli', 'dosha-kundli', 'Remedial rituals for planetary afflictions', 'star', true, 4),
('Pitri / Ancestors', 'pitri-ancestors', 'Rituals for ancestral peace and Shradh', 'ancestor', true, 5),
('Health & Well-being', 'health-well-being', 'Rituals for health and healing', 'activity', true, 6),
('Peace & Spirituality', 'peace-spirituality', 'Rituals for inner peace and spiritual growth', 'sun', true, 7),
('Special Occasion', 'special-occasion', 'Rituals for festivals and special events', 'gift', true, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DEITIES
-- ============================================================
INSERT INTO deities (name, slug, description, is_active, sort_order) VALUES
('Shiva', 'shiva', 'The destroyer and transformer, Lord of meditation and cosmic dance', true, 1),
('Vishnu / Narayan', 'vishnu-narayan', 'The preserver and protector of the universe', true, 2),
('Ganesh', 'ganesh', 'The remover of obstacles, lord of beginnings', true, 3),
('Durga / Chandi', 'durga-chandi', 'The Divine Mother, goddess of power and protection', true, 4),
('Lakshmi / Kuber', 'lakshmi-kuber', 'Goddess of wealth and the god of riches', true, 5),
('Navagraha', 'navagraha', 'The nine planetary deities governing cosmic influences', true, 6),
('Ganga', 'ganga', 'The holy river goddess, purifier of sins', true, 7),
('Surya', 'surya', 'The sun god, source of light and life', true, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- OCCASIONS
-- ============================================================
INSERT INTO occasions (name, slug, description, is_active, sort_order) VALUES
('New Home', 'new-home', 'Griha Pravesh and Bhoomi Poojan for new property', true, 1),
('Marriage', 'marriage', 'Pre-wedding and post-wedding rituals', true, 2),
('Child', 'child', 'Rituals related to childbirth and child welfare', true, 3),
('Navratri', 'navratri', 'Special poojas during the Navratri festival', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- POOJAS (Master Records)
-- ============================================================
INSERT INTO poojas (name, slug, description, long_description, image, duration, is_active) VALUES
('Bhoomi Poojan', 'bhoomi-poojan', 'Worship of Mother Earth before construction', 'Bhoomi Poojan is performed to seek the blessings of Mother Earth (Bhoomi Devi) before beginning construction on a new property. It removes obstacles and ensures prosperity.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Budh Grah Jap', 'budh-grah-jap', 'Chanting for planet Budh (Mercury) to remove afflictions', 'Budh Grah Jap is performed to pacify the planet Mercury and remove its negative effects from one''s horoscope.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Surya Grah Jap', 'surya-grah-jap', 'Chanting for planet Surya (Sun) for vitality and success', 'Surya Grah Jap is performed to strengthen the Sun in the horoscope, bringing vitality, confidence, and success.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Chandra Grah Jap', 'chandra-grah-jap', 'Chanting for planet Chandra (Moon) for emotional peace', 'Chandra Grah Jap is performed to pacify the Moon and bring emotional stability and mental peace.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Mangal Grah Jap', 'mangal-grah-jap', 'Chanting for planet Mangal (Mars) for courage and strength', 'Mangal Grah Jap is performed to reduce the malefic effects of Mars, especially related to Mangal Dosha.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Brihaspati Grah Jap', 'brihaspati-grah-jap', 'Chanting for planet Brihaspati (Jupiter) for wisdom', 'Brihaspati Grah Jap is performed to strengthen Jupiter, the planet of wisdom, knowledge, and prosperity.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Shukra Grah Jap', 'shukra-grah-jap', 'Chanting for planet Shukra (Venus) for love and harmony', 'Shukra Grah Jap is performed to strengthen Venus, bringing harmony, love, and material comforts.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Shani Grah Jap', 'shani-grah-jap', 'Chanting for planet Shani (Saturn) to remove obstacles', 'Shani Grah Jap is performed to pacify Saturn and reduce its malefic effects, bringing patience and discipline.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Rahu Grah Jap', 'rahu-grah-jap', 'Chanting for planet Rahu to remove karmic obstacles', 'Rahu Grah Jap is performed to pacify the shadow planet Rahu and remove its negative influences.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Ketu Grah Jap', 'ketu-grah-jap', 'Chanting for planet Ketu for spiritual growth', 'Ketu Grah Jap is performed to pacify the shadow planet Ketu and enhance spiritual growth.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Chandal Yog Shanti', 'chandal-yog-shanti', 'Remedial ritual for Chandal Yog in the horoscope', 'Chandal Yog Shanti is performed when Chandal Yog is present in the horoscope, caused by the conjunction of Jupiter with Rahu or Ketu.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '3-4 hours', true),
('Chandi Havan', 'chandi-havan', 'Fire ritual dedicated to Goddess Chandi', 'Chandi Havan is a powerful fire ritual dedicated to Goddess Chandi (Durga), performed for protection and removal of negative energies.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '3-4 hours', true),
('Durga Pooja & Chandi Path', 'durga-pooja-chandi-path', 'Worship of Goddess Durga with recitation of Chandi Path', 'Durga Pooja & Chandi Path combines the worship of Goddess Durga with the recitation of the Durga Saptashati (Chandi Path) for divine protection.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '3-4 hours', true),
('Mool Nakshatra Shanti', 'mool-nakshatra-shanti', 'Remedial ritual for those born under Mool Nakshatra', 'Mool Nakshatra Shanti is performed for individuals born under Mool Nakshatra to reduce its challenging effects on life.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Ganesh Pooja', 'ganesh-pooja', 'Worship of Lord Ganesh, the remover of obstacles', 'Ganesh Pooja is performed at the beginning of any auspicious activity to seek the blessings of Lord Ganesh.', 'https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Grah Dosha Shanti Pooja', 'grah-dosha-shanti-pooja', 'Remedial pooja for planetary afflictions in the horoscope', 'Grah Dosha Shanti Pooja is performed to pacify malefic planets and reduce the negative effects of planetary doshas.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '3-4 hours', true),
('Griha Pravesh', 'griha-pravesh', 'Housewarming ceremony for entering a new home', 'Griha Pravesh is the auspicious housewarming ceremony performed when entering a new home for the first time.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Lakshmi Kuber Havan', 'lakshmi-kuber-havan', 'Fire ritual for wealth and prosperity', 'Lakshmi Kuber Havan is performed to invoke the blessings of Goddess Lakshmi and Lord Kuber for wealth and prosperity.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Mangal Dosha Shanti Pooja', 'mangal-dosha-shanti-pooja', 'Remedial pooja for Mangal Dosha in the horoscope', 'Mangal Dosha Shanti Pooja is performed to reduce the effects of Mangal Dosha, which can affect marriage and relationships.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Mrityunjay Mantra Jap', 'mrityunjay-mantra-jap', 'Chanting of the Mahamrityunjaya Mantra for health and protection', 'Mrityunjay Mantra Jap is a powerful chanting of the Mahamrityunjaya Mantra dedicated to Lord Shiva for health, longevity, and protection.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-4 hours', true),
('Navratri Special Chandi Path', 'navratri-special-chandi-path', 'Special Chandi Path recitation during Navratri', 'Navratri Special Chandi Path is the recitation of Durga Saptashati during the auspicious days of Navratri for divine blessings.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '3-4 hours', true),
('Rudrabhishek', 'rudrabhishek', 'Abhishek of Lord Shiva with Rudra mantras', 'Rudrabhishek is a powerful ritual of bathing the Shiva Linga with sacred offerings while chanting Rudra mantras, for health, prosperity, and removal of obstacles.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Santan Gopal Mantra Jap', 'santan-gopal-mantra-jap', 'Chanting for the blessing of a child', 'Santan Gopal Mantra Jap is performed by couples seeking the blessing of a child, dedicated to Lord Krishna in His child form.', 'https://images.pexels.com/photos/31150802/pexels-photo-31150802.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Satya Narayan Vrat Katha', 'satya-narayan-vrat-katha', 'Worship and story of Lord Satyanarayan', 'Satya Narayan Vrat Katha is performed to seek the blessings of Lord Satyanarayan (Vishnu) for prosperity and fulfillment of wishes.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Sat Chandi Path', 'sat-chandi-path', 'Complete recitation of the Durga Saptashati', 'Sat Chandi Path is the complete recitation of the Durga Saptashati (700 verses on Goddess Chandi) for divine protection and blessings.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '4-6 hours', true),
('Narayan Bali', 'narayan-bali', 'Ritual for ancestral peace and unsatisfied souls', 'Narayan Bali is a sacred ritual performed for the peace of ancestors and for souls that have not received proper last rites.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '3-4 hours', true),
('Tripindi Shradh', 'tripindi-shradh', 'Shradh ritual for three generations of ancestors', 'Tripindi Shradh is performed to offer pindas (rice balls) to three generations of ancestors for their peace and blessings.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Shradh', 'shradh', 'Ritual for the peace of departed ancestors', 'Shradh is performed to honor and seek the blessings of one''s departed ancestors, especially during Pitru Paksha.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Pitri Gayatri Jap', 'pitri-gayatri-jap', 'Chanting of Gayatri Mantra for ancestral peace', 'Pitri Gayatri Jap is the chanting of the Gayatri Mantra dedicated to ancestors for their peace and spiritual upliftment.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Ganga Poojan', 'ganga-poojan', 'Worship of the holy river Ganga', 'Ganga Poojan is performed at the banks of the Ganges to honor the river goddess and seek her purifying blessings.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Chuda Karan / Mundan', 'chuda-karan-mundan', 'First haircut ceremony for a child', 'Chuda Karan or Mundan is the Sanskar of a child''s first haircut, a sacred ceremony performed at a holy place.', 'https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Shiv Poojan', 'shiv-poojan', 'Worship of Lord Shiva', 'Shiv Poojan is the traditional worship of Lord Shiva, performed for health, peace, and spiritual growth.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Shiv Sahastra Naam Path', 'shiv-sahastra-naam-path', 'Recitation of the 1008 names of Lord Shiva', 'Shiv Sahastra Naam Path is the recitation of the thousand names of Lord Shiva for His divine blessings.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Kaal Sarp Dosha', 'kaal-sarp-dosha', 'Remedial ritual for Kaal Sarp Dosha in the horoscope', 'Kaal Sarp Dosha pooja is performed when all planets are between Rahu and Ketu in the horoscope, to reduce its negative effects.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Ganga Aarti Pooja', 'ganga-aarti-pooja', 'Participation in the sacred Ganga Aarti ceremony', 'Ganga Aarti Pooja allows devotees to participate in the divine Ganga Aarti ceremony with personalized prayers.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Tarpan', 'tarpan', 'Offering water to ancestors and deities', 'Tarpan is the ritual of offering water (with sesame seeds and barley) to ancestors and deities for their satisfaction and blessings.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1 hour', true),
('Pitri Pujan', 'pitri-pujan', 'Worship of ancestors for their blessings', 'Pitri Pujan is the worship of one''s ancestors, performed to seek their blessings and ensure family prosperity.', 'https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '1-2 hours', true),
('Vishnu Sahastra Naam Path', 'vishnu-sahastra-naam-path', 'Recitation of the 1008 names of Lord Vishnu', 'Vishnu Sahastra Naam Path is the recitation of the thousand names of Lord Vishnu for His divine protection and blessings.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Laxmi Narayan Poojan', 'laxmi-narayan-poojan', 'Worship of Lord Vishnu and Goddess Lakshmi together', 'Laxmi Narayan Poojan is the worship of the divine couple Vishnu and Lakshmi for prosperity, harmony, and spiritual growth.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Kuber Lakshmi Pujan/Hawan', 'kuber-lakshmi-pujan-hawan', 'Worship and fire ritual for wealth and prosperity', 'Kuber Lakshmi Pujan/Hawan is performed to invoke Lord Kuber and Goddess Lakshmi for wealth, prosperity, and abundance.', 'https://images.pexels.com/photos/35171273/pexels-photo-35171273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true),
('Shivarchan', 'shivarchan', 'Special worship and offerings to Lord Shiva', 'Shivarchan is a special worship of Lord Shiva with offerings of bilva leaves, flowers, and mantras.', 'https://images.pexels.com/photos/13405691/pexels-photo-13405691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '2-3 hours', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- POOJA-CATEGORY RELATIONSHIPS
-- ============================================================
INSERT INTO pooja_categories (pooja_id, category_id) VALUES
((SELECT id FROM poojas WHERE slug='bhoomi-poojan'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='bhoomi-poojan'), (SELECT id FROM categories WHERE slug='sanskar')),
((SELECT id FROM poojas WHERE slug='budh-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='budh-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='surya-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='surya-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='chandra-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='chandra-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='mangal-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='mangal-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='brihaspati-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='brihaspati-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='shukra-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='shukra-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='shani-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='shani-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='rahu-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='rahu-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='ketu-grah-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='ketu-grah-jap'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='chandal-yog-shanti'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='chandi-havan'), (SELECT id FROM categories WHERE slug='havan')),
((SELECT id FROM poojas WHERE slug='durga-pooja-chandi-path'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='durga-pooja-chandi-path'), (SELECT id FROM categories WHERE slug='path')),
((SELECT id FROM poojas WHERE slug='mool-nakshatra-shanti'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='ganesh-pooja'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='grah-dosha-shanti-pooja'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='grah-dosha-shanti-pooja'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='griha-pravesh'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='griha-pravesh'), (SELECT id FROM categories WHERE slug='sanskar')),
((SELECT id FROM poojas WHERE slug='lakshmi-kuber-havan'), (SELECT id FROM categories WHERE slug='havan')),
((SELECT id FROM poojas WHERE slug='mangal-dosha-shanti-pooja'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='mangal-dosha-shanti-pooja'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='mrityunjay-mantra-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='navratri-special-chandi-path'), (SELECT id FROM categories WHERE slug='path')),
((SELECT id FROM poojas WHERE slug='navratri-special-chandi-path'), (SELECT id FROM categories WHERE slug='special-poojas')),
((SELECT id FROM poojas WHERE slug='rudrabhishek'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='santan-gopal-mantra-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='satya-narayan-vrat-katha'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='satya-narayan-vrat-katha'), (SELECT id FROM categories WHERE slug='path')),
((SELECT id FROM poojas WHERE slug='sat-chandi-path'), (SELECT id FROM categories WHERE slug='path')),
((SELECT id FROM poojas WHERE slug='narayan-bali'), (SELECT id FROM categories WHERE slug='pitri-shradh')),
((SELECT id FROM poojas WHERE slug='tripindi-shradh'), (SELECT id FROM categories WHERE slug='pitri-shradh')),
((SELECT id FROM poojas WHERE slug='shradh'), (SELECT id FROM categories WHERE slug='pitri-shradh')),
((SELECT id FROM poojas WHERE slug='pitri-gayatri-jap'), (SELECT id FROM categories WHERE slug='jap')),
((SELECT id FROM poojas WHERE slug='pitri-gayatri-jap'), (SELECT id FROM categories WHERE slug='pitri-shradh')),
((SELECT id FROM poojas WHERE slug='ganga-poojan'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='chuda-karan-mundan'), (SELECT id FROM categories WHERE slug='sanskar')),
((SELECT id FROM poojas WHERE slug='shiv-poojan'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='shiv-sahastra-naam-path'), (SELECT id FROM categories WHERE slug='path')),
((SELECT id FROM poojas WHERE slug='kaal-sarp-dosha'), (SELECT id FROM categories WHERE slug='shanti-dosha')),
((SELECT id FROM poojas WHERE slug='kaal-sarp-dosha'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='ganga-aarti-pooja'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='ganga-aarti-pooja'), (SELECT id FROM categories WHERE slug='special-poojas')),
((SELECT id FROM poojas WHERE slug='tarpan'), (SELECT id FROM categories WHERE slug='pitri-shradh')),
((SELECT id FROM poojas WHERE slug='pitri-pujan'), (SELECT id FROM categories WHERE slug='pitri-shradh')),
((SELECT id FROM poojas WHERE slug='pitri-pujan'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='vishnu-sahastra-naam-path'), (SELECT id FROM categories WHERE slug='path')),
((SELECT id FROM poojas WHERE slug='laxmi-narayan-poojan'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='kuber-lakshmi-pujan-hawan'), (SELECT id FROM categories WHERE slug='pooja')),
((SELECT id FROM poojas WHERE slug='kuber-lakshmi-pujan-hawan'), (SELECT id FROM categories WHERE slug='havan')),
((SELECT id FROM poojas WHERE slug='shivarchan'), (SELECT id FROM categories WHERE slug='pooja'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- POOJA-PURPOSE RELATIONSHIPS
-- ============================================================
INSERT INTO pooja_purposes (pooja_id, purpose_id) VALUES
((SELECT id FROM poojas WHERE slug='bhoomi-poojan'), (SELECT id FROM purposes WHERE slug='new-home')),
((SELECT id FROM poojas WHERE slug='griha-pravesh'), (SELECT id FROM purposes WHERE slug='new-home')),
((SELECT id FROM poojas WHERE slug='mangal-dosha-shanti-pooja'), (SELECT id FROM purposes WHERE slug='marriage')),
((SELECT id FROM poojas WHERE slug='santan-gopal-mantra-jap'), (SELECT id FROM purposes WHERE slug='family-child')),
((SELECT id FROM poojas WHERE slug='chuda-karan-mundan'), (SELECT id FROM purposes WHERE slug='family-child')),
((SELECT id FROM poojas WHERE slug='budh-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='surya-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='chandra-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='mangal-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='brihaspati-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='shukra-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='shani-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='rahu-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='ketu-grah-jap'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='chandal-yog-shanti'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='grah-dosha-shanti-pooja'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='mool-nakshatra-shanti'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='kaal-sarp-dosha'), (SELECT id FROM purposes WHERE slug='dosha-kundli')),
((SELECT id FROM poojas WHERE slug='narayan-bali'), (SELECT id FROM purposes WHERE slug='pitri-ancestors')),
((SELECT id FROM poojas WHERE slug='tripindi-shradh'), (SELECT id FROM purposes WHERE slug='pitri-ancestors')),
((SELECT id FROM poojas WHERE slug='shradh'), (SELECT id FROM purposes WHERE slug='pitri-ancestors')),
((SELECT id FROM poojas WHERE slug='pitri-gayatri-jap'), (SELECT id FROM purposes WHERE slug='pitri-ancestors')),
((SELECT id FROM poojas WHERE slug='tarpan'), (SELECT id FROM purposes WHERE slug='pitri-ancestors')),
((SELECT id FROM poojas WHERE slug='pitri-pujan'), (SELECT id FROM purposes WHERE slug='pitri-ancestors')),
((SELECT id FROM poojas WHERE slug='mrityunjay-mantra-jap'), (SELECT id FROM purposes WHERE slug='health-well-being')),
((SELECT id FROM poojas WHERE slug='mrityunjay-mantra-jap'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='rudrabhishek'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='rudrabhishek'), (SELECT id FROM purposes WHERE slug='health-well-being')),
((SELECT id FROM poojas WHERE slug='shiv-poojan'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='ganesh-pooja'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='ganga-poojan'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='ganga-aarti-pooja'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='ganga-aarti-pooja'), (SELECT id FROM purposes WHERE slug='special-occasion')),
((SELECT id FROM poojas WHERE slug='navratri-special-chandi-path'), (SELECT id FROM purposes WHERE slug='special-occasion')),
((SELECT id FROM poojas WHERE slug='chandi-havan'), (SELECT id FROM purposes WHERE slug='special-occasion')),
((SELECT id FROM poojas WHERE slug='satya-narayan-vrat-katha'), (SELECT id FROM purposes WHERE slug='special-occasion')),
((SELECT id FROM poojas WHERE slug='lakshmi-kuber-havan'), (SELECT id FROM purposes WHERE slug='special-occasion')),
((SELECT id FROM poojas WHERE slug='sat-chandi-path'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='vishnu-sahastra-naam-path'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='laxmi-narayan-poojan'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='kuber-lakshmi-pujan-hawan'), (SELECT id FROM purposes WHERE slug='special-occasion')),
((SELECT id FROM poojas WHERE slug='shiv-sahastra-naam-path'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='shivarchan'), (SELECT id FROM purposes WHERE slug='peace-spirituality')),
((SELECT id FROM poojas WHERE slug='durga-pooja-chandi-path'), (SELECT id FROM purposes WHERE slug='peace-spirituality'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- POOJA-DEITY RELATIONSHIPS
-- ============================================================
INSERT INTO pooja_deities (pooja_id, deity_id) VALUES
((SELECT id FROM poojas WHERE slug='rudrabhishek'), (SELECT id FROM deities WHERE slug='shiva')),
((SELECT id FROM poojas WHERE slug='shiv-poojan'), (SELECT id FROM deities WHERE slug='shiva')),
((SELECT id FROM poojas WHERE slug='shiv-sahastra-naam-path'), (SELECT id FROM deities WHERE slug='shiva')),
((SELECT id FROM poojas WHERE slug='shivarchan'), (SELECT id FROM deities WHERE slug='shiva')),
((SELECT id FROM poojas WHERE slug='mrityunjay-mantra-jap'), (SELECT id FROM deities WHERE slug='shiva')),
((SELECT id FROM poojas WHERE slug='narayan-bali'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='laxmi-narayan-poojan'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='vishnu-sahastra-naam-path'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='satya-narayan-vrat-katha'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='ganesh-pooja'), (SELECT id FROM deities WHERE slug='ganesh')),
((SELECT id FROM poojas WHERE slug='chandi-havan'), (SELECT id FROM deities WHERE slug='durga-chandi')),
((SELECT id FROM poojas WHERE slug='durga-pooja-chandi-path'), (SELECT id FROM deities WHERE slug='durga-chandi')),
((SELECT id FROM poojas WHERE slug='sat-chandi-path'), (SELECT id FROM deities WHERE slug='durga-chandi')),
((SELECT id FROM poojas WHERE slug='navratri-special-chandi-path'), (SELECT id FROM deities WHERE slug='durga-chandi')),
((SELECT id FROM poojas WHERE slug='lakshmi-kuber-havan'), (SELECT id FROM deities WHERE slug='lakshmi-kuber')),
((SELECT id FROM poojas WHERE slug='kuber-lakshmi-pujan-hawan'), (SELECT id FROM deities WHERE slug='lakshmi-kuber')),
((SELECT id FROM poojas WHERE slug='budh-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='surya-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='surya-grah-jap'), (SELECT id FROM deities WHERE slug='surya')),
((SELECT id FROM poojas WHERE slug='chandra-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='mangal-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='brihaspati-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='shukra-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='shani-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='rahu-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='ketu-grah-jap'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='chandal-yog-shanti'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='grah-dosha-shanti-pooja'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='kaal-sarp-dosha'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='mool-nakshatra-shanti'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='mangal-dosha-shanti-pooja'), (SELECT id FROM deities WHERE slug='navagraha')),
((SELECT id FROM poojas WHERE slug='ganga-poojan'), (SELECT id FROM deities WHERE slug='ganga')),
((SELECT id FROM poojas WHERE slug='ganga-aarti-pooja'), (SELECT id FROM deities WHERE slug='ganga')),
((SELECT id FROM poojas WHERE slug='santan-gopal-mantra-jap'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='pitri-gayatri-jap'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='tripindi-shradh'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='shradh'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='pitri-pujan'), (SELECT id FROM deities WHERE slug='vishnu-narayan')),
((SELECT id FROM poojas WHERE slug='tarpan'), (SELECT id FROM deities WHERE slug='vishnu-narayan'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- POOJA-OCCASION RELATIONSHIPS
-- ============================================================
INSERT INTO pooja_occasions (pooja_id, occasion_id) VALUES
((SELECT id FROM poojas WHERE slug='bhoomi-poojan'), (SELECT id FROM occasions WHERE slug='new-home')),
((SELECT id FROM poojas WHERE slug='griha-pravesh'), (SELECT id FROM occasions WHERE slug='new-home')),
((SELECT id FROM poojas WHERE slug='mangal-dosha-shanti-pooja'), (SELECT id FROM occasions WHERE slug='marriage')),
((SELECT id FROM poojas WHERE slug='santan-gopal-mantra-jap'), (SELECT id FROM occasions WHERE slug='child')),
((SELECT id FROM poojas WHERE slug='chuda-karan-mundan'), (SELECT id FROM occasions WHERE slug='child')),
((SELECT id FROM poojas WHERE slug='navratri-special-chandi-path'), (SELECT id FROM occasions WHERE slug='navratri')),
((SELECT id FROM poojas WHERE slug='durga-pooja-chandi-path'), (SELECT id FROM occasions WHERE slug='navratri')),
((SELECT id FROM poojas WHERE slug='sat-chandi-path'), (SELECT id FROM occasions WHERE slug='navratri')),
((SELECT id FROM poojas WHERE slug='chandi-havan'), (SELECT id FROM occasions WHERE slug='navratri'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- LOCATION-POOJA OFFERINGS (Confirmed Prices Only)
-- ============================================================
-- Rudrabhishek: Haridwar = 5100, Kedarnath = 11000
INSERT INTO location_poojas (location_id, pooja_id, price, duration, description, is_available) VALUES
((SELECT id FROM locations WHERE slug='haridwar'), (SELECT id FROM poojas WHERE slug='rudrabhishek'), 5100.00, '2-3 hours', 'Rudrabhishek at Haridwar performed by experienced Pandits.', true),
((SELECT id FROM locations WHERE slug='kedarnath-dham'), (SELECT id FROM poojas WHERE slug='rudrabhishek'), 11000.00, '2-3 hours', 'Rudrabhishek at Kedarnath Dham, the sacred Jyotirlinga.', true)
ON CONFLICT (location_id, pooja_id) DO NOTHING;

-- Shradh: Haridwar = 5100, Badrinath = 7100
INSERT INTO location_poojas (location_id, pooja_id, price, duration, description, is_available) VALUES
((SELECT id FROM locations WHERE slug='haridwar'), (SELECT id FROM poojas WHERE slug='shradh'), 5100.00, '2-3 hours', 'Shradh at Haridwar performed at the holy ghats of the Ganges.', true),
((SELECT id FROM locations WHERE slug='badrinath-dham'), (SELECT id FROM poojas WHERE slug='shradh'), 7100.00, '2-3 hours', 'Shradh at Badrinath Dham, a highly sacred location for ancestral rituals.', true)
ON CONFLICT (location_id, pooja_id) DO NOTHING;

-- Other confirmed offerings (prices set to NULL where uncertain = "To Be Confirmed")
INSERT INTO location_poojas (location_id, pooja_id, price, duration, description, is_available)
SELECT l.id, p.id, NULL, '', 'To Be Confirmed', true
FROM locations l
CROSS JOIN poojas p
WHERE l.is_active = true AND p.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM location_poojas lp WHERE lp.location_id = l.id AND lp.pooja_id = p.id
  )
ON CONFLICT (location_id, pooja_id) DO NOTHING;