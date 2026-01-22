Set-StrictMode -Off
Set-Item -Path Env:DEPLOYER_PRIVATE_KEY -Value '0x3ed7524b66da7ebedb2618692bdbf46ca3342b0aa931a1f79f7758ab651ecb41'
Set-Item -Path Env:BASE_SEPOLIA_RPC -Value 'https://base-sepolia.g.alchemy.com/v2/1SMOMr-qJJbullsuZdLED'
Write-Output "DEPLOYER_PRIVATE_KEY set: $([string]::IsNullOrEmpty($env:DEPLOYER_PRIVATE_KEY) -eq $false)"
Write-Output "BASE_SEPOLIA_RPC set: $([string]::IsNullOrEmpty($env:BASE_SEPOLIA_RPC) -eq $false)"
Push-Location -Path $PSScriptRoot
npm install --no-audit --no-fund
npx hardhat compile --show-stack-traces
npx hardhat run --network baseSepolia scripts/deploy.ts
Pop-Location
