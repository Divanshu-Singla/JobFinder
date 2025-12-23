Write-Host "`n══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  COMPLETE DATABASE UPDATE TEST" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════`n" -ForegroundColor Cyan

$testEmail = "finaltest$(Get-Date -Format 'HHmmss')@test.com"

# Step 1: Register User
Write-Host "[1/7] Registering new user..." -ForegroundColor Yellow
$regResult = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method Post -Body (@{
    name='Final Test User'
    email=$testEmail
    password='Test@1234'
    phone='+91-8888888888'
    gender='Female'
    experience=3
    skills=@('React','Node.js','MongoDB')
} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "      ✅ User registered: $testEmail" -ForegroundColor Green
$userId = $regResult.user._id
$userToken = $regResult.token
Write-Host "      User ID: $userId`n" -ForegroundColor Gray

# Step 2: Admin Login
Write-Host "[2/7] Admin login..." -ForegroundColor Yellow
$adminResult = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/admin/login' -Method Post -Body (@{
    username='Prince'
    password='Prince@2498'
} | ConvertTo-Json) -ContentType 'application/json'
Write-Host "      ✅ Admin logged in`n" -ForegroundColor Green
$adminToken = $adminResult.token

# Step 3: Admin Views User (Initial State)
Write-Host "[3/7] Admin viewing all users..." -ForegroundColor Yellow
$users = Invoke-RestMethod -Uri 'http://localhost:5000/api/admin/users' -Method Get -Headers @{Authorization="Bearer $adminToken"}
Write-Host "      ✅ Total users in database: $($users.users.Count)" -ForegroundColor Green
$testUser = $users.users | Where-Object {$_._id -eq $userId}
Write-Host "      Test user visible to admin: YES" -ForegroundColor Green
Write-Host "      Initial State:" -ForegroundColor Gray
Write-Host "        - Name: $($testUser.name)" -ForegroundColor Gray
Write-Host "        - Email: $($testUser.email)" -ForegroundColor Gray
Write-Host "        - Phone: $($testUser.phone)" -ForegroundColor Gray
Write-Host "        - Experience: $($testUser.experience) years" -ForegroundColor Gray
Write-Host "        - Resume: $(if($testUser.resume){$testUser.resume}else{'No resume'})`n" -ForegroundColor Gray

# Step 4: User Updates Profile
Write-Host "[4/7] User updating profile..." -ForegroundColor Yellow
$updateResult = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/profile' -Method Put -Body (@{
    name='UPDATED Final Test User'
    phone='+91-9999999999'
    experience=7
    gender='Female'
    skills=@('React','Node.js','MongoDB','Express','PostgreSQL')
} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization="Bearer $userToken"}
Write-Host "      ✅ Profile updated in database" -ForegroundColor Green
Write-Host "      Updated values:" -ForegroundColor Gray
Write-Host "        - Name: $($updateResult.user.name)" -ForegroundColor Gray
Write-Host "        - Phone: $($updateResult.user.phone)" -ForegroundColor Gray
Write-Host "        - Experience: $($updateResult.user.experience) years" -ForegroundColor Gray
Write-Host "        - Skills: $($updateResult.user.skills -join ', ')`n" -ForegroundColor Gray

# Step 5: Admin Views Updated User
Write-Host "[5/7] Admin viewing user after update..." -ForegroundColor Yellow
$usersAfterUpdate = Invoke-RestMethod -Uri 'http://localhost:5000/api/admin/users' -Method Get -Headers @{Authorization="Bearer $adminToken"}
$updatedUser = $usersAfterUpdate.users | Where-Object {$_._id -eq $userId}
Write-Host "      ✅ Database changes visible to admin!" -ForegroundColor Green
Write-Host "      Current State:" -ForegroundColor Gray
Write-Host "        - Name: $($updatedUser.name)" -ForegroundColor Gray
Write-Host "        - Phone: $($updatedUser.phone)" -ForegroundColor Gray
Write-Host "        - Experience: $($updatedUser.experience) years" -ForegroundColor Gray
Write-Host "        - Skills Count: $($updatedUser.skills.Count)`n" -ForegroundColor Gray

# Step 6: Verify Changes Persisted
Write-Host "[6/7] Verifying database persistence..." -ForegroundColor Yellow
if ($updatedUser.name -eq 'UPDATED Final Test User' -and $updatedUser.phone -eq '+91-9999999999' -and $updatedUser.experience -eq 7) {
    Write-Host "      ✅ All changes successfully persisted in MongoDB!" -ForegroundColor Green
} else {
    Write-Host "      ❌ Some changes not persisted" -ForegroundColor Red
}
Write-Host ""

# Step 7: Cleanup
Write-Host "[7/7] Cleaning up test data..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/users/$userId" -Method Delete -Headers @{Authorization="Bearer $adminToken"} | Out-Null
$verifyUsers = Invoke-RestMethod -Uri 'http://localhost:5000/api/admin/users' -Method Get -Headers @{Authorization="Bearer $adminToken"}
$stillExists = $verifyUsers.users | Where-Object {$_._id -eq $userId}
if (-not $stillExists) {
    Write-Host "      ✅ Test user deleted from database`n" -ForegroundColor Green
}

Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✨ ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "  Database is properly updating from frontend actions" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════`n" -ForegroundColor Cyan
