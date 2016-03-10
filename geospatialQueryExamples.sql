-- get location distances from a location
SELECT dest.*,
3956 * 2 * ASIN(SQRT( POWER(SIN(( ST_Y(orig.center) - ST_Y(dest.center)) *  pi()/180 / 2), 2) +COS(ST_Y(orig.center) * pi()/180) * COS(ST_Y(dest.center) * pi()/180) * POWER(SIN((ST_X(orig.center) - ST_X(dest.center)) * pi()/180 / 2), 2) ))
AS distance
FROM locations dest, locations orig
WHERE orig.id = 9
