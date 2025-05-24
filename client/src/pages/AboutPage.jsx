import { BASE_SITE_CONTENT_URL } from '@/constants';
import axios from 'axios';
import CherryEngine from 'cherry-markdown/dist/cherry-markdown.engine.core';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import styles from './AboutPage.module.css';

const cherryEngine = new CherryEngine();

function renderAboutMd(mdString) {
  return cherryEngine.makeHtml(mdString);
}

function AboutPage() {
  const [aboutHtml, setAboutHtml] = useState('');

  useEffect(() => {
    axios.get(`${BASE_SITE_CONTENT_URL}/about.md`).then(res => {
      setAboutHtml(renderAboutMd(res.data));
    }).catch(err => console.error(err));
  }, []);

  return (
    <div
      className={styles.aboutPage}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aboutHtml) }}
    />
  );
}

export default AboutPage;
