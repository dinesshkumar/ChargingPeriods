import pytest
from app import app, db, ChargingPeriod
from datetime import datetime

@pytest.fixture
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost:5432/ChargingPeriods_test'

    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()
            yield testing_client
            db.drop_all()

def test_get_charging_periods(test_client):
    # Add test data to the database
    period1 = ChargingPeriod(period_code='Code1', period_label='label1', start_date=datetime.strptime('2023-01-01', '%Y-%m-%d').date(), end_date=datetime.strptime('2023-01-10', '%Y-%m-%d').date())
    period2 = ChargingPeriod(period_code='code2', period_label='label2', start_date=datetime.strptime('2023-02-01', '%Y-%m-%d').date(), end_date=datetime.strptime('2023-02-10', '%Y-%m-%d').date())
    
    db.session.add(period1)
    db.session.add(period2)
    db.session.commit()

    # Make a GET request to the /charging_periods endpoint
    response = test_client.get('/charging_periods')
    data = response.get_json()

    # Assert the response status code and data
    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['period_code'] == 'Code1'
    assert data[0]['period_label'] == 'label1'
    assert data[0]['start_date'] == '2024-07-30'
    assert data[0]['end_date'] == '2023-07-31'
    assert data[1]['period_code'] == 'code2'
    assert data[1]['period_label'] == 'label2'
    assert data[1]['start_date'] == '2024-07-26'
    assert data[1]['end_date'] == '2024-07-29'


