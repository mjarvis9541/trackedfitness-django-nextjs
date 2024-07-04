type FetchHeaders = { "Content-Type": string; Authorization?: string };

type Brand = {
  id: number;
  name: string;
  slug: string;
  food_count: number;
  created_by_username: string;
  updated_by_username: string;
  created_at: string;
  updated_at: string;
  url: string;
};

type BrandSelect = {
  id: number;
  name: string;
  name_with_count: string;
};

type Exercise = {
  id: number;
  name: string;
  slug: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

type Food = {
  id: number;
  name: string;
  slug: string;
  brand: number;
  brand_name: string;
  brand_slug: string;
  data_value: number;
  data_measurement: string;
  serving: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  fibre: string;
  salt: string;
  sodium: number;
  added_to_diary_count: number;
  added_to_diary_last_quantity: number;
  added_to_diary_last_date: string;
  created_by_username: string;
  updated_by_username: string;
  created_at: string;
  updated_at: string;
  url: string;
};

type Target = {
  id: number;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  fibre: string;
  salt: string;
  percent_protein: number;
  percent_carbohydrate: number;
  percent_fat: number;
  energy_per_kg: string;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  created_at: string;
  updated_at: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  profile_id: number;
  target_id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  is_private: boolean;
  is_followed: boolean;
  follower_count: number;
  followers: any[];
  following: any[];
  following_count: number;
  date_joined: string;
  last_login: string;
};

type Profile = {
  id: number;
  username: string;
  goal: string;
  get_goal_display: string;
  activity_level: string;
  get_activity_level_display: string;
  sex: "M" | "F";
  get_sex_display: string;
  weight: string;
  height: string;
  date_of_birth: string;
  is_private: boolean;
  bmi: number;
  bmr: number;
  tdee: number;
  created_at: string;
  updated_at: string;
  image: string;
};

type Meal = {
  id: number;
  user: number;
  name: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  fibre: string;
  protein: string;
  salt: string;
  food_count: number;
  created_by_username: string;
  updated_by_username: string;
  created_at: string;
  updated_at: string;
};

type MealItem = {
  id: number;
  meal: number;
  food: number;
  food_name: string;
  brand_id: number;
  brand_name: string;
  data_value: number;
  data_measurement: string;
  quantity: string;
  quantity_input: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  fibre: string;
  protein: string;
  salt: string;
  created_by_username: string;
  updated_by_username: string;
  created_at: string;
  updated_at: string;
};

type Progress = {
  id?: number;
  username?: string;
  date: string;
  notes?: string;
  weight?: number;
  week_avg_weight?: number;
  energy_burnt?: number;
  week_avg_energy_burnt?: number;
  created_at?: string;
  updated_at?: string;
};

type DietDay = {
  id: number;
  user: number;
  username: string;
  is_private: boolean;
  date: string;
  meal: number;
  quantity: string;
  quantity_input: number;
  food_id: number;
  food_name: string;
  brand_id: number;
  brand_name: string;
  data_value: number;
  data_measurement: string;
  energy: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  saturates: number;
  sugars: number;
  fibre: number;
  salt: number;
  total_meal_energy: number;
  total_meal_fat: number;
  total_meal_saturates: number;
  total_meal_carbohydrate: number;
  total_meal_sugars: number;
  total_meal_fibre: number;
  total_meal_protein: number;
  total_meal_salt: number;
  total_day_energy: number;
  total_day_fat: number;
  total_day_saturates: number;
  total_day_carbohydrate: number;
  total_day_sugars: number;
  total_day_fibre: number;
  total_day_protein: number;
  total_day_salt: number;
  total_day_energy_per_kg: number;
  total_day_protein_per_kg: number;
  total_day_carbohydrate_per_kg: number;
  total_day_fat_per_kg: number;
  total_day_protein_pct: number;
  total_day_carbohydrate_pct: number;
  total_day_fat_pct: number;
  updated_at: string;
  created_at: string;
};

type DietTargetDate = {
  id?: number;
  date: string;
  username?: string;
  is_private: boolean;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  fibre: string;
  salt: string;
  weight: string;
  energy_per_kg: number;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  percent_protein: number;
  percent_carbohydrate: number;
  percent_fat: number;
  created_at: string;
  updated_at: string;
};

type DietTargetDateInput = {
  id: number;
  date: string;
  username: string;
  weight: string;
  protein_per_kg: number;
  carbohydrate_per_kg: number;
  fat_per_kg: number;
  notes: string;
  energy_burnt: string;
};

type DietWeek = {
  date: string;
  username: string;
  total_day_energy: number;
  total_day_fat: number;
  total_day_saturates: number;
  total_day_carbohydrate: number;
  total_day_sugars: number;
  total_day_fibre: number;
  total_day_protein: number;
  total_day_salt: number;
  total_day_energy_per_kg: number;
  total_day_protein_per_kg: number;
  total_day_carbohydrate_per_kg: number;
  total_day_fat_per_kg: number;
  total_day_protein_pct: number;
  total_day_carbohydrate_pct: number;
  total_day_fat_pct: number;
  total_week_energy: number;
  total_week_protein: number;
  total_week_fat: number;
  total_week_carbohydrate: number;
  total_week_saturates: number;
  total_week_sugars: number;
  total_week_fibre: number;
  total_week_salt: number;
  avg_week_energy: number;
  avg_week_protein: number;
  avg_week_fat: number;
  avg_week_carbohydrate: number;
  avg_week_saturates: number;
  avg_week_sugars: number;
  avg_week_fibre: number;
  avg_week_salt: number;
  total_week_energy_per_kg: number;
  total_week_protein_per_kg: number;
  total_week_carbohydrate_per_kg: number;
  total_week_fat_per_kg: number;
  total_week_protein_pct: number;
  total_week_carbohydrate_pct: number;
  total_week_fat_pct: number;
  last_updated_at: string;
};

type DietTargetWeek = {
  id?: string;
  username: string;
  is_private?: string;
  date: string;
  energy: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  saturates: string;
  sugars: string;
  fibre: string;
  salt: string;
  weight: string;
  energy_per_kg: string;
  protein_per_kg: string;
  carbohydrate_per_kg: string;
  fat_per_kg: string;
  percent_protein: string;
  percent_carbohydrate: string;
  percent_fat: string;
  created_at: string;
  updated_at: string;
};

type TrainingPlan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  created_at: string;
  updated_at: string;
};

type TrainingPlanList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<TrainingPlan>;
};
