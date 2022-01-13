"""ChartJS and d3 Demo"""

from datetime import datetime, timedelta
from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route('/')
def show_homepage():
    """Show homepage."""

    return render_template('index.html')


@app.route('/chartjs')
def show_chartjs():
    """Show ChartJS demo."""

    return render_template('chartjs.html')


@app.route('/sales_this_week.json')
def get_sales_this_week():
    """Get melon sales data as JSON."""

    # Create fake data. This could also be real data from your database.

    order_dates = []
    date = datetime.now()
    for _ in range(7):
        order_dates.append(date)
        date = date - timedelta(days=1)
    order_totals = [20, 24, 36, 27, 20, 17, 22]

    sales_this_week = []
    for date, total in zip(order_dates, order_totals):
        # `date` is a datetime object; datetime objects can't be JSONified,
        # so we have to convert it to a string with `date.isoformat()`
        # ISO is a standard date/time format that most progamming languages can parse
        # See https://www.iso.org/iso-8601-date-and-time-format.html for more.

        sales_this_week.append({'date': date.isoformat(),
                                'melons_sold': total})

    return jsonify({'data': sales_this_week})


@app.route('/d3')
def show_d3():
    """Show d3 demo."""

    return render_template('d3.html')


@app.route('/tech_topics.json')
def get_web_tech():
    return jsonify({
        'name': 'topics',
        'children': [
            {'name': 'os',
             'children': [{'name': 'macOS'},
                          {'name': 'Windows'},
                          {'name': 'Linux'}]
             },
            {'name': 'language',
             'children': [{'name': 'Python'},
                          {'name': 'JavaScript'},
                          {'name': 'HTML'},
                          {'name': 'CSS'}]
             },
            {'name': 'library/module',
             'children': [{'name': 'datetime'},
                          {'name': 'd3'}]
             }
        ]
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
