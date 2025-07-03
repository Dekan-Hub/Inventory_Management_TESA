const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class AuditLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs/audit');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Registrar acción de auditoría
   */
  logAction(userId, action, resource, details = {}) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };

    // Log a archivo
    this.writeToFile(auditEntry);
    
    // Log a consola
    logger.info('AUDIT', auditEntry);
  }

  /**
   * Escribir entrada de auditoría a archivo
   */
  writeToFile(auditEntry) {
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `audit-${date}.log`);
    
    const logLine = JSON.stringify(auditEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine, 'utf8');
  }

  /**
   * Registrar creación de recurso
   */
  logCreate(userId, resource, resourceId, details = {}) {
    this.logAction(userId, 'CREATE', resource, {
      ...details,
      resourceId,
      action: 'CREATE'
    });
  }

  /**
   * Registrar actualización de recurso
   */
  logUpdate(userId, resource, resourceId, changes = {}, details = {}) {
    this.logAction(userId, 'UPDATE', resource, {
      ...details,
      resourceId,
      changes,
      action: 'UPDATE'
    });
  }

  /**
   * Registrar eliminación de recurso
   */
  logDelete(userId, resource, resourceId, details = {}) {
    this.logAction(userId, 'DELETE', resource, {
      ...details,
      resourceId,
      action: 'DELETE'
    });
  }

  /**
   * Registrar acceso a recurso
   */
  logAccess(userId, resource, resourceId, details = {}) {
    this.logAction(userId, 'ACCESS', resource, {
      ...details,
      resourceId,
      action: 'ACCESS'
    });
  }

  /**
   * Registrar autenticación
   */
  logAuth(userId, action, details = {}) {
    this.logAction(userId, action, 'AUTH', {
      ...details,
      action
    });
  }

  /**
   * Registrar error de seguridad
   */
  logSecurityError(userId, action, error, details = {}) {
    this.logAction(userId, 'SECURITY_ERROR', action, {
      ...details,
      error: error.message,
      stack: error.stack
    });
  }

  /**
   * Obtener logs de auditoría por fecha
   */
  getAuditLogs(date) {
    const logFile = path.join(this.logDir, `audit-${date}.log`);
    
    if (!fs.existsSync(logFile)) {
      return [];
    }

    const content = fs.readFileSync(logFile, 'utf8');
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  }

  /**
   * Obtener logs de auditoría por usuario
   */
  getAuditLogsByUser(userId, limit = 100) {
    const logs = [];
    const files = fs.readdirSync(this.logDir);
    
    for (const file of files) {
      if (file.startsWith('audit-') && file.endsWith('.log')) {
        const content = fs.readFileSync(path.join(this.logDir, file), 'utf8');
        const fileLogs = content
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
          .filter(log => log.userId === userId);
        
        logs.push(...fileLogs);
      }
    }

    return logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Obtener logs de auditoría por recurso
   */
  getAuditLogsByResource(resource, resourceId, limit = 100) {
    const logs = [];
    const files = fs.readdirSync(this.logDir);
    
    for (const file of files) {
      if (file.startsWith('audit-') && file.endsWith('.log')) {
        const content = fs.readFileSync(path.join(this.logDir, file), 'utf8');
        const fileLogs = content
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
          .filter(log => log.resource === resource && log.details.resourceId === resourceId);
        
        logs.push(...fileLogs);
      }
    }

    return logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

module.exports = new AuditLogger(); 