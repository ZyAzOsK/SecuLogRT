<<<<<<< HEAD
Project Overview
Goals

The Linux Security Event Monitoring System aims to provide real-time monitoring of security-related events in a Linux environment, similar to Windows Event Log functionality. It captures and logs critical system events such as file modifications, process activities, network connections, authentication attempts, and system logs.
Expected Outcomes

    A real-time event logging system that captures security events.

    A structured SQLite database (security_events.db) storing logged events.

    Categorization of logs into File Changes, Processes, Network Activity, Authentication Logs, and System Logs.

    An interactive CLI allowing users to start and stop monitoring easily.

    A persistent log system that resets when the script restarts.

Scope

    Includes real-time logging of security events on a Linux system.

    Excludes advanced threat detection, log analysis dashboards, and integration with SIEM tools (can be added later).

    Works with SQLite for local event storage (can be upgraded to PostgreSQL or Elasticsearch).

Module-Wise Breakdown
Module 1: Event Monitoring System

Purpose: Captures security-related events such as file changes, process execution, network connections, and authentication attempts.
Role: The core component responsible for tracking system activities and logging security events.
Module 2: Event Storage & Database Management

Purpose: Stores security event logs in an SQLite database.
Role: Ensures that security logs are structured and retrievable for analysis.
Module 3: Command-Line Interface (CLI) for Interaction

Purpose: Provides an easy way for users to start, stop, and manage event monitoring.
Role: Enables users to interact with the monitoring system without modifying code.
Functionalities
1. Event Monitoring System Functionalities

    File Change Monitoring: Detects file modifications, creations, and deletions in /var/log/.

    Process Monitoring: Tracks new and terminated processes running on the system.

    Network Monitoring: Captures active outbound connections and logs their details.

    Authentication Log Monitoring: Tracks login attempts, both successful and failed.

    System Log Monitoring: Captures important system events using journalctl.

2. Event Storage & Database Management Functionalities

    Stores logs in an SQLite database (security_events.db).

    Clears database when the monitoring script is restarted.

    Categorizes logs into different event types with timestamps.

3. CLI Functionalities

    Starts and stops monitoring.

    Provides a prompt for exiting the script (exit() instead of Ctrl+C).

    Displays logs in a structured format.

Technology Recommendations

    Programming Language: Python

    Libraries & Tools:

        psutil (Process monitoring)

        watchdog (File monitoring)

        pyinotify (Linux file event monitoring)

        sqlite3 (Database storage)

        journalctl (System log retrieval)

    Database: SQLite (security_events.db)

    Environment: Linux (Arch-based, Debian-based, etc.)

Execution Plan
Phase 1: Setup & Installation

    Install dependencies:

    pip install psutil watchdog pyinotify

    Ensure access to /var/log/ and other system logs.

Phase 2: Development

    Implement BaseMonitor class for logging events.

    Develop individual monitors:

        file_change_monitor.py

        process_monitor.py

        network_monitor.py

        auth_log_monitor.py

        syslog_monitor.py

        journald_monitor.py

    Integrate them into security_logger.py.

Phase 3: Testing & Debugging

    Run python security_logger.py and ensure real-time logging.

    Check database entries using SQLite:

    sqlite3 security_events.db "SELECT * FROM security_events;"

    Simulate events (creating/deleting files, starting/killing processes, logging in/out).

Phase 4: Deployment & Documentation

    Add CLI interaction for smooth execution (exit() instead of Ctrl+C).

    Ensure the database resets on script restart.

    Document installation and usage guidelines.
