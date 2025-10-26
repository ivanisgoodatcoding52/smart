-- Seed some popular colleges for testing
INSERT INTO colleges (name, location, acceptance_rate, avg_gpa, avg_sat, avg_act, tuition, ranking) VALUES
  ('Harvard University', 'Cambridge, MA', 3.19, 4.00, 1520, 34, 57261, 1),
  ('Stanford University', 'Stanford, CA', 3.68, 3.96, 1505, 34, 56169, 2),
  ('Massachusetts Institute of Technology', 'Cambridge, MA', 3.96, 4.00, 1535, 35, 57986, 3),
  ('Yale University', 'New Haven, CT', 4.62, 4.00, 1515, 34, 62250, 4),
  ('Princeton University', 'Princeton, NJ', 4.38, 3.95, 1515, 34, 57410, 5),
  ('University of California, Berkeley', 'Berkeley, CA', 11.37, 3.89, 1430, 32, 44115, 15),
  ('University of Michigan', 'Ann Arbor, MI', 17.73, 3.90, 1435, 33, 53232, 23),
  ('New York University', 'New York, NY', 12.20, 3.71, 1470, 33, 58168, 25),
  ('University of California, Los Angeles', 'Los Angeles, CA', 8.56, 3.93, 1435, 32, 43022, 20),
  ('University of Southern California', 'Los Angeles, CA', 9.90, 3.79, 1460, 33, 64726, 22)
ON CONFLICT DO NOTHING;
