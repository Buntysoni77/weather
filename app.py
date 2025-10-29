from flask import Flask, render_template, request

app = Flask(__name__)
app.debug = True  # ensures static files reload automatically

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    location = request.form['location']
    humidity = float(request.form['humidity'])
    precip = float(request.form['precip'])
    wind = float(request.form['wind'])
    
    # Dummy prediction logic
    temp = round(20 + humidity*0.05 - wind*0.1, 2)
    if temp > 25:
        weather = "Hot"
    elif temp > 15:
        weather = "Mild"
    else:
        weather = "Cold"
    
    return render_template('result.html', location=location, temp=temp, weather=weather)

if __name__ == '__main__':
    app.run()
