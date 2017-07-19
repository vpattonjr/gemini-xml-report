# gemini-xml-reporter
XML report for Gemini using junit-report-builder and code from gemini-reporter-bamboo, much thanks to the devs of those projects.  
junit-report-builder https://github.com/davidparsson/junit-report-builder <br>
gemini-reporter-bamboo https://www.npmjs.com/package/gemini-reporter-bamboo

I mainly created this because I needed and xml report format so that I may run the tests in Jenkins and keep track of pass, fails, and runtime.
I plan to add more test information into the xml as time goes by, but this is a good start.

.gemini.yml:
```yaml
system:
  plugins:
    gemini-xml-reporter:
```

This will create a report named gemini-xml-report.xml in your reports folder

