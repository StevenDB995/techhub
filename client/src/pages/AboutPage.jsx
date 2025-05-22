// noinspection JSClosureCompilerSyntax

import { BASE_SITE_CONTENT_URL } from '@/constants';
import axios from 'axios';
import CherryEngine from 'cherry-markdown/dist/cherry-markdown.engine.core';
import { useEffect, useState } from 'react';
import './AboutPage.css';

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

  return <div className="about-page" dangerouslySetInnerHTML={{ __html: aboutHtml }} />;
}

export default AboutPage;
