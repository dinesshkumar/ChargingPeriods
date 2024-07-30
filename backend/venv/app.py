# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:123@localhost:5432/ChargingPeriods'
CORS(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class ChargingPeriod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    period_code = db.Column(db.String(10), unique=True, nullable=False)
    period_label = db.Column(db.String(50))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f'<ChargingPeriod {self.period_code}>'

@app.route('/charging_periods', methods=['POST'])
def create_charging_period():
    data = request.json
    period_code = data['period_code']
    period_label = data.get('period_label', '')
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

    if start_date >= end_date:
        return jsonify({'error': 'End date must be greater than start date'}), 400

    charging_period = ChargingPeriod(
        period_code=period_code,
        period_label=period_label,
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(charging_period)
    db.session.commit()
    return jsonify({'message': 'Charging period created successfully'}), 201

@app.route('/charging_periods', methods=['GET'])
def get_charging_periods():
    periods = ChargingPeriod.query.all()
    return jsonify([{
        'id': period.id,
        'period_code': period.period_code,
        'period_label': period.period_label,
        'start_date': period.start_date.isoformat(),
        'end_date': period.end_date.isoformat()
    } for period in periods]), 200

if __name__ == '__main__':
    app.run(debug=True)
