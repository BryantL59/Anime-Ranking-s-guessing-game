import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify

app = Flask(__name__)
@app.route('/scrape', methods=['GET'])

def scrape():
    website = 'https://myanimelist.net/topanime.php'
    response = requests.get(website)
    content = response.text

    soup = BeautifulSoup(content, 'lxml')

    table = soup.find('table', class_='top-ranking-table')

    for row in table.find_all('tr', class_='ranking-list'):
        rank = row.find('td', class_='rank').get_text(strip=True)
        title = row.find('h3', class_='anime_ranking_h3').get_text(strip=True)
        score = row.find('td', class_='score').get_text(strip=True)
        
        data = print(f'Rank: {rank}, Title: {title}, Score: {score}')

        return jsonify(data)
    

if __name__ == '__main__':
    app.run(debug=True)
