waitTime = 10
detectMultipleface = True
cameraType="IN"
server = "10.10.10.127"
port = "1433"
user = 'sa'
password = "user@123"
database = "AttendnceTrackingSystem"
videoSource = 0
apiBaseUrl = "http://localhost:5147/api"

connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server},{port};DATABASE={database};UID={user};PWD={password}'