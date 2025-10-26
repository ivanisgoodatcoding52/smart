-- Seed some sample college data
insert into public.colleges (name, acceptance_rate, avg_gpa, avg_sat, avg_act, location, type, size) values
  ('Harvard University', 3.4, 4.18, 1520, 34, 'Cambridge, MA', 'Private', 23000),
  ('Stanford University', 3.9, 3.96, 1505, 34, 'Stanford, CA', 'Private', 17000),
  ('MIT', 4.1, 4.17, 1535, 35, 'Cambridge, MA', 'Private', 11500),
  ('UC Berkeley', 14.5, 3.89, 1430, 32, 'Berkeley, CA', 'Public', 45000),
  ('UCLA', 10.8, 3.93, 1435, 32, 'Los Angeles, CA', 'Public', 46000),
  ('Yale University', 4.6, 4.14, 1515, 34, 'New Haven, CT', 'Private', 14500),
  ('Princeton University', 4.4, 3.95, 1515, 34, 'Princeton, NJ', 'Private', 8500),
  ('Columbia University', 3.9, 4.15, 1520, 34, 'New York, NY', 'Private', 33000),
  ('University of Michigan', 20.2, 3.88, 1435, 32, 'Ann Arbor, MI', 'Public', 47000),
  ('Cornell University', 7.3, 4.07, 1480, 33, 'Ithaca, NY', 'Private', 24000)
on conflict do nothing;
