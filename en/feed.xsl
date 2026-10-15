<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="utf-8"/>
<xsl:template match="/"><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>LEGEND OF THE MAHJONG KING · RSS</title><link rel="stylesheet" href="https://novel.mahjongx.net/assets/style.css?v=011944b2"/></head>
<body><main class="reader subpage"><h1 class="ch">LEGEND OF THE MAHJONG KING</h1><p class="lead">This is the site&#x27;s feed (RSS) for reader apps. Copy this page&#x27;s address into Feedly, Inoreader or a similar reader to get new chapters automatically.</p>
<ul class="ways"><xsl:for-each select="a:feed/a:entry"><li><a><xsl:attribute name="href"><xsl:value-of select="a:link/@href"/></xsl:attribute><xsl:value-of select="a:title"/></a></li></xsl:for-each></ul>
<p class="center"><a href="https://novel.mahjongx.net/en/">Back to the home page</a></p></main></body></html></xsl:template></xsl:stylesheet>
