import React from "react";
import AudioPlayer from "../common/AudioPlayer";
import Title from "../common/section-title";
import portfolioBackground from "../../assets/img/portfolio-background.jpg";
import portfolioBackground2 from "../../assets/img/portfolio-background2.jpg";

function Portfolio() {
  return (
    <div id="portfolio">
      <div class="portfolio-bar"></div>
      <div class="portfolio-blocks">
        <div id="portfolio-title">
          <h1>Samples</h1>
          <hr />
          <p>
          We have gone through the task of selecting the most illustrative sounds for your benefit. Where does your movie begin?
          </p>
          <p>Recommended listen = ★</p>
        </div>

        <div id="portfolio-sub-menu">
          <ul>
            <li>
              <a href="#films-section">Films</a>
            </li>
            <li>
              <a href="#podcasts-section">Podcasts</a>
            </li>
            <li>
              <a href="#music-section">Music</a>
            </li>
          </ul>
        </div>

        {/*<AudioPlayer title="" poster="" ext="" tracks={[]} />*/}
        <div id="podcasts">
        <hr id="podcasts-section"></hr>
        <Title
          title="Podcasts"
          color="transparent"
          fontColor="white"
          border="2px solid white"
        />
        
        <div className="intro-portfolio" id="podcasts-intro">
          <p>
            "No Pienses en Monos" is a podcast series featuring a collection of
            11 episodes, each presenting a unique fable re-narrated in Spanish.
            Crafted by Jaime Osvaldo, the series explores various stories
            inspired by Osho, brought to life through voice acting, ambient
            soundscapes, and sound effects. The episodes range from mystical
            tales to thought-provoking parables, each enriched with natural
            sounds and carefully mixed audio elements. This podcast represents
            Jaime's dedication to audio craftsmanship, offering listeners an
            engaging and immersive storytelling experience.
          </p>
          <div id="portfolio-background2"><img src={portfolioBackground2} alt="Space background for the portfolio"></img></div>
        </div>

        <div id="podcast-stuff" className="portfolio-column">
          <div id="podcast-window">
            <iframe
              width="100%"
              height="600"
              scrolling="no"
              frameBorder="no"
              title="No Pienses en Monos"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1565212765&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
            ></iframe>
            <div
              style={{
                fontSize: "10px",
                color: "#cccccc",
                lineBreak: "anywhere",
                wordBreak: "normal",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                borderRadius: "0px",
                fontFamily:
                  "Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif",
                fontWeight: "100",
              }}
            >
              <a
                href="https://soundcloud.com/nopiensesenmonos"
                title="No Pienses en Monos"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cccccc", textDecoration: "none" }}
              ></a>
              <a
                href="https://soundcloud.com/nopiensesenmonos/sets/no-pienses-en-monos"
                title="No Pienses en Monos"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cccccc", textDecoration: "none" }}
              ></a>
            </div>
          </div>
        </div>
        </div>
        <hr id="music-section"></hr>
        <Title
          title="Music"
          color="black"
          fontColor="white"
          border="0px solid white"
        />
        <div id="album-list">
        <div id="portfolio-background3"><img src={portfolioBackground} alt="Space background for the portfolio"></img></div>
          <div className="albums">
            {" "}
            <iframe
              title="negrita-album"
              style={{ border: "0", width: "350px", height: "555px", borderRadius: "0px" }}
              src="https://bandcamp.com/EmbeddedPlayer/album=4029898044/size=large/bgcol=333333/linkcol=e99708/transparent=true/"
              seamless
            >
              {" "}
              <a href="https://jaimeosvaldo.bandcamp.com/album/negrita-es-la-noche-oscura-de-mi-alma-ep">
                Negrita es la noche oscura de mi alma EP by Jaime Osvaldo
              </a>
            </iframe>
          </div>
          <div className="albums">
            <iframe
              title="isla-album"
              style={{ border: "0", width: "350px", height: "720px", borderRadius: "0px" }}
              src="https://bandcamp.com/EmbeddedPlayer/album=2719182319/size=large/bgcol=333333/linkcol=e99708/transparent=true/"
              seamless
            >
              <a href="https://jaimeosvaldo.bandcamp.com/album/isla-encantada">
                Isla Encantada by Jaime Osvaldo
              </a>
            </iframe>
          </div>
          <div className="albums">
            <iframe
              title="spirit-album"
              style={{ border: "0", width: "350px", height: "786px", borderRadius: "0px"}}
              src="https://bandcamp.com/EmbeddedPlayer/album=1330167475/size=large/bgcol=333333/linkcol=e99708/transparent=true/"
              seamless
            >
              <a href="https://jaimeosvaldo.bandcamp.com/album/endless-spirit-of-the-earth">
                {" "}
                Endless Spirit of the Earth by Jaime Osvaldo
              </a>
            </iframe>
          </div>
        </div>
        <hr id="films-section"></hr>
        <div id="portfolio-background1"><img src={portfolioBackground} alt="Space background for the portfolio"></img></div>
        <Title
         
          title="Films"
          color="transparent"
          fontColor="white"
          border="1px solid white"
        />

        {/* Title outputs title in component, movie selects poster (poster must have same name but 'Poster' at the end. Ext 1 parameter is the picture second parameter is the audio extension*/}
        <div className="portfolio-column">
          
        <AudioPlayer
            title="El Pastor"
            poster="ElPastorPoster.png"
            ext=".wav"
            tracks={[
              ["PASTOR_track1", "Foley & Ambience "],
              ["PASTOR_track2", "★ Sound Fx & Ambience"],
              ["PASTOR_track3", "Ambience"],
            ]}
          />
          <AudioPlayer
            title="La Obra"
            poster="LaObraPoster.png"
            ext=".wav"
            tracks={[
              ["OBRA_track1", "★ Musique concrète/Sound Design"],
              ["OBRA_track2", "★ Music"],
              ["OBRA_track3", "★ Music & Ambience"],
              ["OBRA_track4", "Sound FX & Foley"],
              ["OBRA_track5", "Music"],
            ]}
          />
          
        </div>
        <div className="portfolio-column">
          
          <AudioPlayer
            title="Hijas de la Invasión"
            poster="HDLIPoster.png"
            ext=".wav"
            tracks={[["HDLI_track1", "Sound FX & Ambience"], ["HDLI_track2", "Sound FX, Ambience & Music"], ["HDLI_track3", "★ Foley & Ambience"]]}
          />
          <AudioPlayer
            title="Las Hortensias"
            poster="HortensiasPoster.jpg"
            ext=".wav"
            tracks={[
              ["HORT_track1", "Music & Sound FX"],
              ["HORT_track2", "★ Sound FX"],
              ["HORT_track3", "Sound FX, Ambience & Foley"],
              ["HORT_track4", "★ Sound FX, ADR Ambience & Foley"],
            ]}
          />
          
        </div>

        <div className="portfolio-column">
          
          <AudioPlayer
            title="Juan Caballo"
            poster="JCPoster.png"
            ext=".wav"
            tracks={[["JC_track1", "★ Sound FX, Ambience & Foley"], ["JC_track2", "★ Sound FX"], ["JC_track3", "★ Sound FX"]]}
          />
          <AudioPlayer
            title="The Omicron Killer"
            poster="OmicronPoster.png"
            ext=".wav"
            tracks={[
              ["TOK_track1", "Ambience & Sound FX"],
              ["TOK_track2", "Sound FX"],
              ["TOK_track3", "Foley"],
              ["TOK_track4", "Ambience & Music"],
              ["TOK_track5", "Ambience & Foley"],
              ["TOK_track6", "Ambience & Sound FX"],
              ["TOK_track7", "Ambience & Sound FX"],
              ["TOK_track8", "Ambience"],
              ["TOK_track9", "Ambience"],
              ["TOK_track10", "Sound FX & Foley"],
              ["TOK_track11", "Sound FX & Foley"],
              ["TOK_track12", "Sound FX & Foley"],
              ["TOK_track13", "Sound FX & Foley"],
            ]}
          />
          
        </div>
        <div className="portfolio-column">
        <AudioPlayer
            title="Belly to the Ground (unreleased)"
            poster="BTTGPoster.webp"
            ext=".wav"
            tracks={[
              ["BTTG_track1", "Ambience & Sound FX"],
              ["BTTG_track2", "Ambience"],
              ["BTTG_track3", "★ Sound FX"],
              ["BTTG_track4", "Sound FX"]
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
