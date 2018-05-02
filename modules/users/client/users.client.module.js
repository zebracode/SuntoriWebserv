'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core', 'userprices']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin', 'userprices']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);
ApplicationConfiguration.registerModule('users.services', ['userprices']);
