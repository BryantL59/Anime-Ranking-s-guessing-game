import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['GET'])
def scrape():
    website = 'https://myanimelist.net/topanime.php'
    response = requests.get(website)
    content = response.text

    soup = BeautifulSoup(content, 'lxml')

    table = soup.find('table', class_='top-ranking-table')
    
    anime_list = []

    for row in table.find_all('tr', class_='ranking-list'):
        rank = row.find('td', class_='rank').get_text(strip=True)
        title = row.find('h3', class_='anime_ranking_h3').get_text(strip=True)
        score = row.find('td', class_='score').get_text(strip=True)
        
        anime_list.append({
            'rank': rank,
            'title': title,
            'score': score
        })

    return jsonify(anime_list)

if __name__ == '__main__':
    app.run(debug=True)
