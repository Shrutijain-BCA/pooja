/*
# Sync pooja prices and scriptural content

1. Purpose
- Store the handwritten prices in the database so copied projects display the same values.
- Store the Hindi scriptural procedure and benefits shown on the pooja detail page.

2. Modified Tables
- `location_poojas`: updates the price for every available location offering belonging to the listed pooja.
- `poojas`: updates `vidhi` and `laba` for Bhoomi Poojan and Griha Pravesh.

3. Security
- No new tables, permissions, or policies are created.
- Existing row-level security and public read access remain unchanged.

4. Important Notes
- This migration is repeatable and does not delete rows or columns.
- Prices are applied consistently across all 19 locations for each listed pooja.
- Other unclear handwritten entries remain unchanged until their exact pooja name and amount are confirmed.
*/

UPDATE location_poojas AS lp
SET price = prices.amount
FROM poojas AS p
JOIN (
  VALUES
    ('bhoomi-poojan', 7100::numeric),
    ('budh-grah-jap', 2100::numeric),
    ('surya-grah-jap', 2100::numeric),
    ('chandra-grah-jap', 2100::numeric),
    ('mangal-grah-jap', 2100::numeric),
    ('brihaspati-grah-jap', 5100::numeric),
    ('shukra-grah-jap', 5100::numeric),
    ('shani-grah-jap', 7100::numeric),
    ('rahu-grah-jap', 7100::numeric),
    ('ketu-grah-jap', 7100::numeric),
    ('chandal-yog-shanti', 4100::numeric),
    ('chandi-havan', 11000::numeric),
    ('durga-pooja-chandi-path', 7100::numeric),
    ('mool-nakshatra-shanti', 11000::numeric),
    ('ganesh-pooja', 5100::numeric),
    ('grah-dosha-shanti-pooja', 6100::numeric),
    ('griha-pravesh', 7100::numeric),
    ('lakshmi-kuber-havan', 6100::numeric),
    ('mangal-dosha-shanti-pooja', 6100::numeric),
    ('mrityunjay-mantra-jap', 21000::numeric),
    ('navratri-special-chandi-path', 21000::numeric),
    ('rudrabhishek', 5100::numeric),
    ('santan-gopal-mantra-jap', 15000::numeric),
    ('satya-narayan-vrat-katha', 4100::numeric),
    ('sat-chandi-path', 71000::numeric)
) AS prices(slug, amount) ON prices.slug = p.slug
WHERE lp.pooja_id = p.id
  AND lp.is_available = true;

UPDATE poojas
SET
  vidhi = 'मत्स्य पुराण के वास्तु-पुरुष आख्यान के अनुसार, भूमि या भवन निर्माण के दोषों को दूर करने के लिए यह पूजा होती है। इसमें वास्तु पुरुष मंडल का निर्माण कर 45 देवताओं का आवाहन किया जाता है। नवग्रह शांति के साथ-साथ शिलान्यास या गृह-प्रवेश के समय वास्तु देव के निमित्त विशेष आहुतियां देकर भवन के केंद्र (ब्रह्मस्थान) को ऊर्जान्वित किया जाता है।',
  laba = 'पंचमहाभूतों (पृथ्वी, जल, अग्नि, वायु, आकाश) का संतुलन बनता है, जिससे भवन में रहने वालों को मानसिक शांति, उत्तम स्वास्थ्य और समृद्धि प्राप्त होती है तथा आकस्मिक दुर्घटनाओं का नाश होता है।'
WHERE slug IN ('bhoomi-poojan', 'griha-pravesh');