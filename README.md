## DISCLAIMER
The code was made just for fun and I'm not responsible for if usage (or any parts)
All what you do - you do it at own risk
May cause ban (as minimum)
If you have no idea how to do something then better don't

## Preparations
This project was created using nodejs version 10.15.3.
In case of issues with launching test-cases check installed nodejs version.

## Download
Download project files using:
```
git clone https://github.com/ignatas/orn
```
Navigate to the directory with downloaded files and install all required dependencies for project using:
```
npm install
```
add ./cypress.json file manually
```
{
  "env": {
    "version": "client side version number",
    "agent": "your device user agent",
    "sid": "your session token",
    "raidBattle": "uuid=the ID of battle"
  },
  "defaultCommandTimeout": 50000,
  "responseTimeout": 60000,
  "reporter": "mocha-allure-reporter",
  "reporterOptions": {
    "mochaFile": "/results/test-output.xml",
    "toConsole": true
  }
}
```
Fiddler/Charlies can be used to get that info from original request

## Start

To run scripts launch cypress using:
```
npx cypress run
```
Then just select the necessary bot-program
- map : saves Shop (any building) and Boss of your current location (needs travelling)
- orna : kills monsters around you
- bosskiller : kills the raid boss

# Note

Works with orna server up to 1.70

You should change the scope of spells that suites your character and get a lot of HP/MP poitons