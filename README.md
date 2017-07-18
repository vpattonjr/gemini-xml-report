# gemini-xml-report
XML report for Gemini using junit-report-builder and code from gemini-json-reporter. This was built using code from gemini-json-reporter, much thanks to the devs who wrote that.  
This also uses junit-report-builder https://github.com/davidparsson/junit-report-builder

I mainly created this because I needed and xml report format so that I may run the tests in Jenkins an keep track of pass, fails, and runtime.
I plan to add more test information into the xml as time goes by, but this is a good start.

.gemini.yml:
```yaml
system:
  plugins:
    gemini-xml-reporter:
```

This will create a report named gemini-xml-report.xml in your reports folder
